//
// import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
// import {DOMWrapper, mount} from '@vue/test-utils'
// import { Cropper } from '@/components';
// import { SelectionModel } from '@/components';
// import { CropperExposed } from './TestedModels';
//
// describe('Cropper', () => {
//     //Мокинг Fetch для имитации запроса
//     beforeEach(() => {
//         jest.clearAllMocks();
//         global.fetch = jest.fn(() => Promise.resolve({
//             ok: true,
//             json: () => Promise.resolve({ croppedImage: 'data:image/png;base64,croppedImage...' }),
//         } as unknown as Response)
//         ) as jest.MockedFunction<typeof fetch>;
//     });
//
//     //Очистка мокав после каждого теста
//     afterEach(() => {
//         jest.restoreAllMocks();
//     });
//
//     test('cropImage отправляет верный запрос с данными и после ответа записывает в croppedImage', async () => {
//         const wrapper = mount(Croper);
//         const vm = wrapper.vm as unknown as CropperExposed;
//
//         // Установка начальных данных
//         vm.imageSrc = 'data:image/png;base64,initialImageData';
//         vm.selection = new SelectionModel(50, 50, 150, 150);
//
//         // Вызов cropImage
//         const result = await vm.cropImage('data:image/png;base64,initialImageData', vm.getCropData());
//
//         // Проверка, что fetch был вызван с правильными данными
//         expect(global.fetch).toHaveBeenCalledWith('/api/crop', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 image: 'data:image/png;base64,initialImageData',
//                 crop: { X: 50, Y: 50, Height: 150, Width: 150 },
//             }),
//         });
//
//         // Проверка результата и обновления croppedImage
//         expect(result).toEqual({ croppedImage: 'data:image/png;base64,croppedImage...' });
//         expect(vm.croppedImage).toBe('data:image/png;base64,croppedImage...');
//     });
//
//     test('cropImage отваливается с ошибкой, если введенные данные неверны', async () => {
//         const wrapper = mount(Cropper);
//         const vm = wrapper.vm as unknown as CropperExposed;
//
//         // Проверка, что imageSrc отсутствует
//         vm.imageSrc = null;
//
//         // Вызов cropImage и проверка, что возникает ошибка
//         await expect(vm.cropImage("", vm.getCropData()))
//             .rejects.toThrow('Требуются вводные данные');
//     });
//
//     test('cropImage обробатывает серверную ошибку (ответ не ok)', async () => {
//         const wrapper = mount(Cropper);
//         const vm = wrapper.vm as unknown as CropperExposed;
//
//         // Замокаем fetch для возврата ответа с ok: false
//         global.fetch = jest.fn(() => Promise.resolve({
//             ok: false,
//             status: 500,
//             json: () => Promise.resolve({ error: 'Ошибка сервера' }),
//         } as unknown as Response));
//
//         vm.imageSrc = 'data:image/png;base64,initialImageData';
//         vm.selection = new SelectionModel(50, 50, 150, 150);
//
//         // Проверяем, что cropImage отклоняет промис с ожидаемой ошибкой
//         await expect(vm.cropImage('data:image/png;base64,initialImageData', vm.selection))
//             .rejects.toThrow('Ошибка при обрезке изображения');
//     });
//
//     test('cropImage вызывается при нажатии кнопки "Обрезать"', async () => {
//         const wrapper = mount(Croper);
//         const vm = wrapper.vm as unknown as CropperExposed;
//
//         // Устанавливаем imageSrc
//         vm.imageSrc = 'data:image/png;base64,initialImageData';
//
//         vm.selection = new SelectionModel(50, 50, 150, 150);
//
//         // Ожидание обновления DOM
//         await wrapper.vm.$nextTick();
//         console.log('Rendered HTML:', wrapper.html()); // Для отладки
//
//         // Поиск кнопки ("Обрезать")
//         let button = new DOMWrapper<HTMLButtonElement>(null);
//         wrapper.findAll('button').forEach((buttons) => {
//             if (buttons.text() == "Обрезать") button = buttons;
//         })
//
//         console.log(button.text());
//
//         expect(button.exists()).toBe(true);
//
//         // Эмуляция клика
//         await button.trigger('click');
//
//         // Проверка вызов fetch
//         expect(global.fetch).toHaveBeenCalledWith('/api/crop', expect.anything());
//
//         // Проверка результат
//         expect(vm.croppedImage).toBe('data:image/png;base64,croppedImage...');
//     });
// });