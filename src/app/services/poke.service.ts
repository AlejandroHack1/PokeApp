import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeService {

  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';


  constructor(private http: HttpClient) { }

  getPokemons(limit: number, offset: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?limit=${limit}&offset=${offset}`);
  }

  getPokemonImage(id: any): string {
    if (!id) return '';
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  getPokemonById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

}