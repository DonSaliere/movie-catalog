import { MovieService } from 'src/services/movie.service';
import { Movie } from './../../../model/movie';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
	movies: Movie[] = [];
	filteredMovies: Movie[] = [];
	initialLoading = true;
	error: string | null = null;
	searchTerm = '';

	constructor(
		private movieService: MovieService,
		private dialog: MatDialog
   ) {}

	ngOnInit() {
   	this.loadMovies();
   }

  	loadMovies() {
		this.initialLoading = true;
		this.error = null;
    
	this.movieService.getMovies().subscribe({
		next:(movies) => {
			this.movies = movies;
			this.filteredMovies = movies;
			this.initialLoading = false;
		},
		error:(error) => {
			this.error = error.message;
			this.initialLoading = false;
			console.error('Error loading movies:', error);
		}
	});
  }

	onSearch(term: string) {
		this.searchTerm = term;
		
		if (!term.trim()) {
		this.filteredMovies = this.movies;
		return;
	}
	
	this.movieService.searchMovies(term).subscribe({
	next: (movies) => {
		this.filteredMovies = movies;
	},
	error: (error) => {
		this.error = error.message;
		console.error('Error searching movies:', error);
	}
	});
  }

	openMovieDetails(movie: Movie) {
		this.dialog.open(MovieDetailsComponent, {
		width: '800px',
		data: movie
	});
  }

	retry() {
		this.error = null;
		this.loadMovies();
	}

  	trackByMovieId(index: number, movie: Movie): number {
  		return movie.id;
	}
}