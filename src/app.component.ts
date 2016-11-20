import { Component } from '@angular/core';

import { FileUpLoader } from './directive/modules/file-uploader.class';
import { FileItem } from './directive/modules/file-item.class';
@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: "/lib/template/app.html"
})
export class AppComponent {
  public uploader = new FileUpLoader({
    url: "https://evening-anchorage-3159.herokuapp.com/api/",
    method: "POST",
    autoUpload: false,
    onProgress: (FileItem: FileItem, thisFileProgress: number, allProgress: number) => {
      document.getElementById(FileItem.id).style.width = thisFileProgress + "%";
      console.log(FileItem.file.name + ">" + thisFileProgress);
      document.getElementById('all').style.width = allProgress + "%";

    },
    data: (FileItem: FileItem) => {
      let formData = new FormData();
      formData.append("User", "123123");
      return formData;
    }
  });
}