import { reactive, ref} from "vue"

const useStore = () => {
    /**Изображение для обрезки */
    const image = ref<HTMLImageElement>(new Image());

    /**Обрезанное изображение */
    const croppedImage = ref();

    return({image, croppedImage});
}

const store = reactive(useStore());
export { store };