import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Movie } from './../model/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:3000/movies';

  constructor(private http: HttpClient) { }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  searchMovies(term: string): Observable<Movie[]> {
    return this.getMovies().pipe(
      map(movies => {
        if (!term.trim()) {
          return movies;
        }
        
        const searchTerm = term.toLowerCase();
        return movies.filter(movie => 
          movie.title.toLowerCase().includes(searchTerm)
        );
      }),
      catchError(this.handleError)
    );
  }
  
  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}