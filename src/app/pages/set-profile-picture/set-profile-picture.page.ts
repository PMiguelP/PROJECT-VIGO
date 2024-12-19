import { Component } from '@angular/core';

@Component({
  selector: 'app-set-profile-picture',
  templateUrl: './set-profile-picture.page.html',
  styleUrls: ['./set-profile-picture.page.scss'],
})
export class SetProfilePicturePage {
  images = Array.from({ length: 3 }, (_, rowIndex) => ({
    name: `Row ${rowIndex + 1}`, // Nome de cada linha
    items: Array.from(
      { length: 5 },
      (_, imageIndex) =>
        `https://via.placeholder.com/150?text=Row${rowIndex + 1}-Image${
          imageIndex + 1
        }` // URLs dinâmicas
    ),
  }));

  // Método chamado ao clicar em uma imagem
  selectImage(image: string) {
    console.log('Selected image:', image);
    // Lógica para tratar a imagem selecionada
  }
}
