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

    //上次上传的时候的大小
    public lastLoadeSize: number = null;

    //上次上传的速度
    public lastSpaeed: number = null;

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
            if (this.uploader.fileUpLoaderOption.onProgress != undefined || this.uploader.fileUpLoaderOption.onAllProgress != undefined) {

                //初始化值
                if (this.uploader.lastLoadeDate === null)
                    this.uploader.lastLoadeDate = new Date();
                if (this.lastLoadeSize === null)
                    this.lastLoadeSize = 0;
                if (this.lastSpaeed === null)
                    this.lastSpaeed = 0;

                this.progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);

                //计算出上次调用该方法时到现在的时间差，单位为s
                let pertime: number = (new Date().getTime() - this.uploader.lastLoadeDate.getTime()) / 1000;
                //记录
                this.uploader.lastLoadeDate = new Date();

                let perLoad = event.loaded - this.lastLoadeSize;
                //记录
                this.lastLoadeSize = event.loaded;
                //计算速度B单位
                let speed: number = perLoad / pertime;
                if (this.progress === 100)
                    speed = 0;

                this.lastSpaeed = speed;


                if (this.uploader.fileUpLoaderOption.onProgress != undefined)
                    this.uploader.fileUpLoaderOption.onProgress(this, this.progress, this.getSpeed(speed));


                if (this.uploader.fileUpLoaderOption.onAllProgress != undefined) {

                    let allProgress: number = 0;
                    this.uploader.files.map((file: FileItem) => {
                        allProgress += file.progress;
                    });

                    let allSpeed = 0;

                    this.uploader.files.map((fileItem: FileItem) => {
                        allSpeed += fileItem.lastSpaeed;
                    });

                    //计算速度B单位
                    let speed: number = perLoad / pertime;

                    this.uploader.fileUpLoaderOption.onAllProgress(allProgress * (100 / this.uploader.files.length) / 100, this.getSpeed(allSpeed));
                }
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

    /**根据速度计算出单位并返回带有单位和时间的字符串(500kb/s) 
     * @param {speed} 计算出来的速度
    */
    private getSpeed(speed: number): string {

        if (speed === Infinity)
            speed = 0;
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

        return speed.toFixed(1) + company + "/s";
    }

    /**停止这个文件的上传
     */
    public abort(): void {
        this._xhr.abort();
    }

    /**从根对象中删除这一上传对象 */
    public remove(): void {
        this.uploader.files.splice(this.uploader.files.indexOf(this), 1);
    }
}