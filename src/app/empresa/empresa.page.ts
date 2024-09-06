import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatebaseService } from '../datebase/datebase.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.page.html',
  styleUrls: ['./empresa.page.scss'],
})
export class EmpresaPage implements OnInit {
  imageUrl: string | undefined;
  imageUrl_membro: string | undefined;
  isModalOpen = false;
  isModalOpen2 = false;
  nome: string = '';//nome do memro
  servico: string = '';//servico do membro
  membros: { nome: string; imagem: string }[] = [];//array com nome do membro e foto de perfil

  constructor(
    private alertController: AlertController,
    private db: DatebaseService ,
  ) { }
  async openImagePicker() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos, // Use CameraSource.Camera para abrir a câmera
    });

    this.imageUrl = image.webPath;
  }


  async openImageMembro() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos, // Use CameraSource.Camera para abrir a câmera

    });

    if (image.webPath) {
      this.imageUrl_membro = image.webPath;
  }}
  salvaMembro(){
      // Adiciona ao array `membros` se a URL da imagem não for undefined
      if (this.imageUrl_membro) {

      this.membros.push({ nome: this.nome, imagem: this.imageUrl_membro }); 
  }
  this.imageUrl_membro = "";

}
  confirmarDados(){
    if (this.nome != ""){
      this.setOpen(false)
      this.salvaMembro()
    }
  }
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  
  setOpen2(isOpen: boolean) {
    this.isModalOpen2 = isOpen;
  }

  ngOnInit() {
  }

}