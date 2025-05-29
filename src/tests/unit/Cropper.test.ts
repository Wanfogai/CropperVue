import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { mount } from '@vue/test-utils'
import { Cropper } from '@/components/widget/Croper';
import { CropperExposed } from './TestedModels';
import { CropData } from '@/app/interfaces';

describe('Cropper', () => {
    //Мокинг Fetch для имитации запроса
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ croppedImage: 'data:image/png;base64,croppedImage...' }),
        } as unknown as Response)
        ) as jest.MockedFunction<typeof fetch>;
    });

    //Очистка мокав после каждого теста
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('cropImage отправляет верный запрос с данными и возвращает результат с обрезанным изображением', async () => {
        const wrapper = mount(Cropper, {
            props: {
                image: 'data:image/png;base64,initialImageData',
                magnificRate: 1
            }
        });
        const vm = wrapper.vm as unknown as CropperExposed;

        // Мокаем getCropData метод для $cropZone
        vm.$cropZone = {
            getCropData: jest.fn((magnificRate) => ({ X: 50, Y: 50, Height: 150, Width: 150 } as CropData))
        };

        // Вызов cropImage и сохранение результата
        const result = await vm.cropImage('data:image/png;base64,initialImageData');

        // Проверка, что fetch был вызван с правильными данными
        expect(global.fetch).toHaveBeenCalledWith('/api/crop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: 'data:image/png;base64,initialImageData',
                crop: { X: 50, Y: 50, Height: 150, Width: 150 },
            }),
        });

        // Проверка возвращаемого значения функции
        expect(result.croppedImage).toBe('data:image/png;base64,croppedImage...');
    });

    test('cropImage отваливается с ошибкой, если введенные данные неверны', async () => {
        const wrapper = mount(Cropper);
        const vm = wrapper.vm as unknown as CropperExposed;

        // Вызов cropImage с пустыми данными и проверка, что возникает ошибка
        await expect(vm.cropImage(""))
            .rejects.toThrow('Требуются вводные данные');
    });

    test('cropImage обробатывает серверную ошибку (ответ не ok)', async () => {
        const wrapper = mount(Cropper, {
            props: {
                image: 'data:image/png;base64,initialImageData',
                magnificRate: 1
            }
        });
        const vm = wrapper.vm as unknown as CropperExposed;

        // Мокаем getCropData метод для $cropZone
        vm.$cropZone = {
            getCropData: jest.fn((magnificRate) => ({ X: 50, Y: 50, Height: 150, Width: 150 } as CropData))
        };

        // Замокаем fetch для возврата ответа с ok: false
        global.fetch = jest.fn(() => Promise.resolve({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ error: 'Ошибка сервера' }),
        } as unknown as Response));

        // Проверяем, что cropImage отклоняет промис с ожидаемой ошибкой
        await expect(vm.cropImage('data:image/png;base64,initialImageData'))
            .rejects.toThrow('Ошибка при обрезке изображения');
    });
});
