import { FileUpLoader, Header } from './file-uploader.class';


export class FileItem {
    constructor(private newFile: File, private uploader: FileUpLoader) {
        this.file = newFile;
    }
    //唯一标示
    public id: string = this.uploader.getNewGuid();
    //异步请求对象
    public _xhr: XMLHttpRequest;
    //当前文件对象
    public file: File;
    //上传进度
    public progress: number = 0;
    /**
     * 上传当前项
     */
    public upLoaderFile(): void {
        let formData: any = this.file;

        this._xhr = new XMLHttpRequest();

        if (this.uploader.fileUpLoaderOption.setHeader != undefined) {
            let headers: Array<Header> = this.uploader.fileUpLoaderOption.setHeader(this);
            headers.map((header) => {
                this._xhr.setRequestHeader(header.name, header.value);
            });
        }
        if (this.uploader.fileUpLoaderOption.data !== undefined) {
            formData = this.uploader.fileUpLoaderOption.data(this);

            formData.append(this.uploader.fileUpLoaderOption.alias, this.file);
        }
        this._xhr.upload.onprogress = (event: any) => {
            this.progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
            if (this.uploader.fileUpLoaderOption.onProgress != undefined) {
                let allProgress: number = 0;
                this.uploader.files.map((file: FileItem) => {
                    allProgress += file.progress;
                });
                this.uploader.fileUpLoaderOption.onProgress(this, this.progress, allProgress * (100 / this.uploader.files.length) / 100);
            }
        }

        /**在传输中报错处理 */
        this._xhr.onerror = (e) => {
            if (this.uploader.fileUpLoaderOption.onError !== undefined)
                this.uploader.fileUpLoaderOption.onError(e, this);
        }
        /**在传输中终止处理 */
        this._xhr.onabort = (e) => {
            if (this.uploader.fileUpLoaderOption.onAbort != undefined)
                this.uploader.fileUpLoaderOption.onAbort(this);
        }
        this._xhr.open(this.uploader.fileUpLoaderOption.method,
            this.uploader.fileUpLoaderOption.url,
            this.uploader.fileUpLoaderOption.async,
            this.uploader.fileUpLoaderOption.user,
            this.uploader.fileUpLoaderOption.password);

        this._xhr.send(formData);
    }

    public abort(): void {
        this._xhr.abort();
    }

    public remove(): void {
        this.uploader.files.splice(this.uploader.files.indexOf(this),1);
    }
}