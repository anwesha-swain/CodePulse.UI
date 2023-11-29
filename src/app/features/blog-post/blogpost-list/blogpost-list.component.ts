import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { BlogPostService } from '../blog-post.service';
import { BlogPost } from '../models/blog-post.model';

@Component({
  selector: 'app-blogpost-list',
  templateUrl: './blogpost-list.component.html',
  styleUrl: './blogpost-list.component.css'
})
export class BlogpostListComponent implements OnInit {
  blogPosts$?: Observable<BlogPost[]>;
  constructor(private blogPostService: BlogPostService) {}

  ngOnInit(): void {
    //get all blog posts from api
    this.blogPosts$ = this.blogPostService.getAllBlogPosts();
  }

}
