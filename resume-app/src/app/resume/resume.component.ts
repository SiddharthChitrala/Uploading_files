// src/app/resume/resume.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
})
export class ResumeComponent implements OnInit {
  selectedFile: File | null = null;
  resumes: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getResumes();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadResume() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('resume', this.selectedFile);

    this.http.post('http://localhost:3000/upload', formData).subscribe(
      (response) => {
        console.log('Resume uploaded successfully');
        this.selectedFile = null;
        this.getResumes();
      },
      (error) => {
        console.error('Error uploading resume', error);
      }
    );
  }

  getResumes() {
    this.http.get('http://localhost:3000/resumes').subscribe((data: any) => {
      this.resumes = data;
    });
  }
}
