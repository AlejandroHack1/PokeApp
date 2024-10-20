import { Component } from '@angular/core';
import { PokeService } from '../services/poke.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DetallesPage } from '../detalles/detalles.page';
import { AlertController, ModalController } from '@ionic/angular';


@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.page.html',
  styleUrls: ['./pokemon.page.scss'],
})
export class PokemonPage {

  pokemons: any = [];
  filteredPokemons: any = [];
  searchTerm: string = '';
  capturedPhoto: any;
  selectedLimit: number = 10;
  editingPokemonIndex: number | null = null;
  editedPokemon: any = {};
  addingNewPokemon: boolean = false;

  constructor(private pokeService: PokeService, private modalController: ModalController, private alertController: AlertController) {
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokeService.getPokemons(this.selectedLimit, 0).subscribe(data => {
      this.pokemons = data.results;
      this.filteredPokemons = this.pokemons;
    });
  }

  filterPokemons() {
    if (this.searchTerm) {
      this.filteredPokemons = this.pokemons.filter((pokemon: { name: string; }) =>
        pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredPokemons = this.pokemons;
    }
  }

  getPokemonImage(id: any): string {
    return this.pokeService.getPokemonImage(id);
  }

  editPokemon(index: number) {
    this.editingPokemonIndex = index;
    this.editedPokemon = { ...this.filteredPokemons[index] };
  }


  addPokemon() {
    this.addingNewPokemon = true;
    this.editedPokemon = { name: '', url: '' };
  }

  savePokemon(index: number | null) {
    if (!this.editedPokemon.name || !this.editedPokemon.url) {
      return alert('Por favor, completa tanto el nombre como la URL del Pokémon.');
    }

    if (index !== null) {
      this.filteredPokemons[index] = this.editedPokemon;
    } else {
      this.filteredPokemons.unshift(this.editedPokemon);
    }

    this.editingPokemonIndex = null;
    this.addingNewPokemon = false;
  }

  cancelEdit() {
    this.editingPokemonIndex = null;
    this.addingNewPokemon = false;
  }

  async deletePokemon(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas eliminar este Pokémon?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.pokemons.splice(index, 1);
            this.filteredPokemons.splice(index, 1);
          }
        }
      ]
    });

    await alert.present();
  }

  async viewDetails(pokemon: any) {
    const modal = await this.modalController.create({
      component: DetallesPage,
      componentProps: { id: pokemon }
    });
    return await modal.present();
  }

  async takePicture() {
    try {
      const { camera } = await Camera.checkPermissions();

      if (camera === "granted" || camera === "prompt") {
        const { base64String } = await Camera.getPhoto({
          presentationStyle: "popover",
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera,
          saveToGallery: true,
          quality: 100
        });

        if (base64String) {
          this.capturedPhoto = `data:image/jpeg;base64,${base64String}`;
          console.log(this.capturedPhoto); // Muestra la imagen capturada
        }
      } else {
        const requestResult = await Camera.requestPermissions({ permissions: ["camera", "photos"] });

        if (requestResult.camera !== "granted") {
          console.error("Permiso de cámara no concedido");
        }
      }
    } catch (error) {
      console.error("Error al tomar la foto:", error);
    }
  }


}



