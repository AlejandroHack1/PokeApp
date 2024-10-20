import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokeService } from '../services/poke.service';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
})
export class DetallesPage {
  pokemon: any;

  constructor(private navParams: NavParams, private pokeService: PokeService, private modalController: ModalController) {
    const pokemonId = this.navParams.get('id');
    this.loadPokemonDetails(pokemonId);
  }

  loadPokemonDetails(id: any) {
    this.pokeService.getPokemonById(id).subscribe(data => {
      this.pokemon = data;

    });


  }

  getPokemonImage(id: any) {
    return this.pokemon ? this.pokeService.getPokemonImage(id) : ''
  }

  dismiss() {
    this.modalController.dismiss();
  }
}

