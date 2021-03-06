import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { storage } from 'firebase/storage';
import { tap } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'upload-minutes',
  templateUrl: './upload-minutes.component.html',
  styleUrls: ['./upload-minutes.component.css']
})

export class UploadMinutesComponent implements OnInit {
  // Main Task
  task: AngularFireUploadTask;
  isHovering: boolean;
  year: number = 2018;
  month: string = 'January';

  constructor(private storage: AngularFireStorage, private db: AngularFirestore) { }

  toggleHover(event: boolean) {
    this.isHovering = true;
  }

  setYear (event: any) {
    this.year = event.target.value;
    console.log('setYear function'  + this.year);
  }

  setMonth (event: any) {
    this.month = event.target.value;
  }

  startUpload(event: FileList, fileType) {
    const month = this.month;
    const year = +this.year;
    console.log(year + 'Uploadevent');
    const file = event.item(0);
    const path = `minutes/${new Date().getTime()}_${file.name}`;
    const fileName = file.name.slice(0, (file.name.length - 4));
    const uploadDate = new Date().getTime();

    const task = this.storage.upload(path, file).then(() => {
      const ref = this.storage.ref(path);
      const downloadURL = ref.getDownloadURL().subscribe(url => {
        // const url = url;
        console.log(url);
        this.db.collection('minutes').add( { path, fileName, uploadDate, url, month, year });
      });
    })
  }

  ngOnInit() {
  }

  }
