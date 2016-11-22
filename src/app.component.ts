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
    onProgress: (FileItem: FileItem, thisFileProgress: number, speed: string) => {
      document.getElementById(FileItem.id + '1').innerHTML = speed;
      document.getElementById(FileItem.id).style.width = thisFileProgress + "%";
    },
    onAllProgress: (progress: number, speed: string) => {
      document.getElementById('speed').innerHTML = speed;
      document.getElementById('all').style.width = progress + "%";
    },
    data: (FileItem: FileItem) => {
      let formData = new FormData();
      formData.append("User", "123123");
      return formData;
    }
  });
}