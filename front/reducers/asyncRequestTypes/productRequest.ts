export interface SearchProducts {
  name : string
}
export interface RegisterProduct {
  data : FormData
}
export interface UploadImages {
    data : FormData;
}

export interface LoadProducts {
    lastId? : number
}
export interface LoadProduct {
    id: string
}
