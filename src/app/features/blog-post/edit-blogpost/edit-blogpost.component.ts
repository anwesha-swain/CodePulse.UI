import { UpdateBlogPost } from './../models/update-blog-post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { BlogPostService } from '../blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/categoryModel';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrl: './edit-blogpost.component.css'
})
export class EditBlogpostComponent implements OnInit, OnDestroy {

  id: string | null = null;
  model?: BlogPost;
  categories$?: Observable<Category[]>;
  selectedCategories?: string[];

  routeSubscription?: Subscription;
  getBlogPostSubscription?: Subscription;
  updateBlogPostSubscription?: Subscription;
 deleteBlogPostSubscription?: Subscription;

  constructor(private route: ActivatedRoute, private blogPostService: BlogPostService, 
    private categoryService: CategoryService, private router: Router){}
 
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
    this.routeSubscription = this.route.paramMap.subscribe({
      next: (params) =>
      {
        this.id = params.get('id');

        //Get BlogPost from api
        if(this.id) {
          this.getBlogPostSubscription = this.blogPostService.getBlogPostById(this.id).subscribe({
            next: (response) => {
              this.model = response;
              this.selectedCategories = response.categories.map(x => x.id);
            }
          });
        }
      }
    });
  }
   
  onFormSubmit(): void {
    //Convert this model to a request object
    if(this.model && this.id)
    {
      var updateBlogPost: UpdateBlogPost = {
        author: this.model.author,
        content: this.model.content,
        shortDescription: this.model.shortDescription,
        featuredImageUrl: this.model.featuredImageUrl,
        isVisible: this.model.isVisible,
        publishedDate: this.model.publishedDate,
        title: this.model.title,
        urlHandle: this.model.urlHandle,
        categories: this.selectedCategories ?? []
      };

      this.updateBlogPostSubscription = this.blogPostService.updateBlogPost(this.id, updateBlogPost).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/blogposts');
        }
      })
    }
  }

  onDelete(): void {
    if(this.id) {
      //call service and delete blogpost
      this.deleteBlogPostSubscription = this.blogPostService.deleteBlogPost(this.id).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/blogposts');
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.getBlogPostSubscription?.unsubscribe();
    this.updateBlogPostSubscription?.unsubscribe();
    this.deleteBlogPostSubscription?.unsubscribe();
  }
  
}
