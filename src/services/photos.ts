import { Photo } from "../types/Photo";
import { storage } from '../libs/firebase';
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';
import { v4 as createId } from 'uuid';


export const getAll = async ()=>{
    let list: Photo[] = [];

    const imagesFolder = ref(storage, "images"); 
    const photoList = await listAll(imagesFolder);

    for(let i in photoList.items){
        let photoUrl = await getDownloadURL(photoList.items[i]);//ele vai gerar uma url do item

        list.push({
            name: photoList.items[i].name,
            url: photoUrl
        });
    }


    return list;
}

export const insert = async (file: File)=> {
    if(['image/jpeg','image/png', 'image/jpg'].includes(file.type)){//ele so aceita esses tipos de arquivos

        let randomaName = createId();//cria um id aleatorio
        let newFile = ref(storage, `images/${randomaName}`); //referencia de onde o arquivo vai

        let upload = await uploadBytes(newFile, file);//envio do arquivo e o formato
        let photoUrl = await getDownloadURL(upload.ref); //cria um url do arquivo

        return{
            name: upload.ref.name,
            url: photoUrl
        } as Photo;

    } else{
        return new Error('Tipo de arquivo não permetido.');
    }
}