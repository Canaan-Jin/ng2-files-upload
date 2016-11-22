import { FileItem } from './file-item.class';

// function isFileLikeObject(value:any) {
export interface Header {
    name: string;
    value: string;
}
export interface FileUpLoaderOption {
    url: string;
    method: string;
    user?: string;
    password?: string;
    async?: boolean;
    data?: (FileItem: FileItem) => FormData;
    alias?: string;
    setHeader?: (FileItem: FileItem) => Array<Header>;
    autoUpload: boolean;
    onProgress?: (FileItem: FileItem, thisFileProgress: number, speed: string) => void;
    onAllProgress?: (progress: number, speed: string) => void;
    onError?: (event: ErrorEvent, fileItem: FileItem) => void;
    onLoad?: (fileItem: FileItem) => void;
    onAbort?: (fileItem: FileItem) => void;

}
export class FileUpLoader {

    constructor(private option: FileUpLoaderOption) {
        this.files = new Array<FileItem>();
        this.fileUpLoaderOption = option;
        this.fileUpLoaderOption.alias = this.fileUpLoaderOption.alias === undefined ? "file1" : this.fileUpLoaderOption.alias;
        this.fileUpLoaderOption.user = this.fileUpLoaderOption.user === undefined ? "" : this.fileUpLoaderOption.user;
        this.fileUpLoaderOption.password = this.fileUpLoaderOption.password === undefined ? "" : this.fileUpLoaderOption.password;
        this.fileUpLoaderOption.async = this.fileUpLoaderOption.async === undefined ? true : this.fileUpLoaderOption.async;
    }
    //配置集合
    public fileUpLoaderOption: FileUpLoaderOption;
    //文件集合
    public files: Array<FileItem>;

    public lastLoadeDate: Date = null;
    /**
     * 添加新项
     * @param {file} 要添加的新文件
     */
    public addFiles(file: File): void {
        //生成一个新的 item
        let newFileItem: FileItem = new FileItem(file, this);
        //向集合中添加新项
        this.files.push(newFileItem);
        //判断是否自动上传
        if (this.option.autoUpload)
            newFileItem.upLoaderFile();
    }

    /**
     * 上传所有文件
     */
    public fileUploaderAll(): void {
        this.files.map((file) => {
            file.upLoaderFile();
        });
    }

    /**
     * 生成一个新的唯一标示
     */
    public getNewGuid(): string {
        let guid: string = "";
        for (let i: number = 1; i <= 32; i++) {
            let n: string = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    }
    /**停止所有 */
    public abortAll(): void {
        this.files.map((item) => {
            item.abort();
        });
    }

    /**删除所有项 */
    public removeAll(): void {
        this.files.map((item) => {
            item.remove();
        });
    }
}