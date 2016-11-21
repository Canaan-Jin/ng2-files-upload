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
    //上次上传的时候的时间
    private lastLoadeDate: Date = null;
    //上次上传的时候的大小
    private lastLoadeSize: number = null;
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
        this._xhr.upload.onprogress = (event: ProgressEvent) => {
            //初始化值
            if (this.lastLoadeDate === null)
                this.lastLoadeDate = new Date();
            if (this.lastLoadeSize === null)
                this.lastLoadeSize = 0;
            //计算出上次调用该方法时到现在的时间差，单位为s
            let pertime: number = (new Date().getTime() - this.lastLoadeDate.getTime()) / 1000;
            //记录
            this.lastLoadeDate = new Date();

            let perLoad = event.loaded - this.lastLoadeSize;
            //记录
            this.lastLoadeSize = event.loaded;
            //计算速度B单位
            let speed: number = perLoad / pertime;
            //这次上传大小
            let company: string = "B";
            //判断是否是 kb大小
            if (speed / 1024 > 1) {
                speed = speed / 1024;
                company = 'KB';
            }
            //判断是否是mb单位大小
            if (speed / 1024 > 1) {
                speed = speed / 1024;
                company = 'MB';
            }

            this.progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
            if (this.uploader.fileUpLoaderOption.onProgress != undefined) {
                let allProgress: number = 0;
                this.uploader.files.map((file: FileItem) => {
                    allProgress += file.progress;
                });
                this.uploader.fileUpLoaderOption.onProgress(this, this.progress, allProgress * (100 / this.uploader.files.length) / 100, speed.toFixed(1) + company + "/s");
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
        this.uploader.files.splice(this.uploader.files.indexOf(this), 1);
    }
}