import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatebaseService } from '../datebase/datebase.service';
import { LoadingController } from '@ionic/angular'; // Importa o LoadingController
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';


@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.page.html',
  styleUrls: ['./empresa.page.scss'],
})
export class EmpresaPage implements OnInit {
  imageUrl: string | undefined;
  imageUrl_membro: string | undefined; //URL LOCAL DA IMAGEM
  url_membro: string = ''; //URL NA NUVEM
  isModalOpen = false;
  isModalOpen2 = false;
  nome: string = '';//nome do memro
  servico: string = '';//servico do membro
  membros: { nome: string; imagem: string }[] = [];//array com nome do membro e foto de perfil
  mudou_dono: boolean = false;
  nome_empresa: string = 'Nome da Empresa'; // Nome inicial
  enviou_membro: boolean = false;
  roleMessage = '';
  selectedColor="";
  cnpj = this.db.cnpj_usuario
  link = "https://agend-today.vercel.app/?cnpj="+this.cnpj

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Insira o nome da sua empresa',
      inputs: [
        {
          name: 'nomeEmpresa',
          type: 'text',
          placeholder: 'Nome da empresa',
          value: this.nome_empresa // Passa o valor atual
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Salvar',
          handler: (data) => {
            this.nome_empresa = data.nomeEmpresa; // Atualiza o nome_empresa com o valor inserido
          },
        },
      ],
    });

    await alert.present();
  };
  constructor(
    private alertController: AlertController,
    private db: DatebaseService ,
    private clipboard: Clipboard,
  ) { }
 copiarTexto(texto: string) {
    navigator.clipboard.writeText(texto).then(() => {
      console.log('Texto copiado para a área de transferência');
    }).catch(err => {
      console.error('Erro ao copiar o texto: ', err);
    });
  }

  async openImagePicker() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos, // Use CameraSource.Camera para abrir a câmera
    });
    this.mudou_dono = true;

    this.imageUrl = image.webPath;
  }
  async salvar() {
    try {
      // Verifica se existe uma URL de imagem para upload
      if (this.mudou_dono == true) {
        const uploadedImageUrl = await this.db.uploadImagedono(this.imageUrl);
        console.log('URL da imagem enviada:', uploadedImageUrl);
      } else {
        console.log('Nenhuma URL de imagem para enviar.');
      }
  
      // Verifica se existe 'membros' antes de salvá-los
      if (this.membros) {
        console.log('entrou no urlmembro:');
        await this.db.adicionarMembros(this.membros);
        console.log('Membros adicionados com sucesso.');
      } else {
        console.error('Nenhum membro para adicionar.');
      }

      if (this.nome_empresa) {
        console.log('entrou no urlmembro:');
        await this.db.salvaNomeEmpresa(this.nome_empresa,this.selectedColor);
        console.log('nome com sucesso.');
      } else {
        console.error('Nenhum membro para adicionar.');
      }
      
      await this.presentSaveSuccessAlert();

    } catch (error) {
      console.error('Erro durante o processo de salvar:', error);
    }
  }

  async presentSaveSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: 'Dados salvos com sucesso!',
      buttons: ['OK']
    });
  
    await alert.present();
  }
  
  async loadimagem() {
    try {
      console.log("Rodou")
      const data = await this.db.getImage();
      if (data) {
        if (data.Urldono) {
          this.imageUrl = data.Urldono;
          console.log('dono carregado',data.imageUrl);
        } else {
          console.log('Imagem do dono errado ein.');
        }
        if (data.membros) {
          this.membros = data.membros;
          console.log('membros carregados',data.imageUrl);
        } else {
          console.log('Imagem do dono errado ein.');
        }
        if (data.nome) {
          this.nome_empresa = data.nome;
          console.log('nome_empresa',data.imageUrl);
        } else {
          console.log('Imagem do dono errado ein.');
        }
      } 
    } catch (error) {
      console.error('Erro ao carregar imagem:', error);
    }
  }

  async presentAlert(membro: any) {
    const alert = await this.alertController.create({
      header: 'Deseja excluir esse membro?!',
      message: membro.nome,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Ação quando cancelar
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            let indice = this.membros.indexOf(membro);
            if (indice !== -1) {
              this.membros.splice(indice, 1);  // Remove o item correto
            }
          },
        },
      ],
    });
    
    await alert.present();
  
    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
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
  
      try {
        // Aguarda o retorno do URL da imagem
        const uploadedImageUrl = await this.db.uploadImagemembro(image.webPath);
        console.log('URL da imagem membro enviadaaaaaaa:', uploadedImageUrl);
        this.url_membro = uploadedImageUrl;
        this.enviou_membro = true// O PROGRAMA SO DEIXA SALVAR O MEMBRO DEPOIS QUE ISSO AQUI FOR TRUE, OU SEJA, DEPOIS QUE O URL FOR ENVIADO
      } catch (error) {
        console.error('Erro no upload da imagem:', error);
      }
    }
  }
  
  salvaMembro(){
      // Adiciona ao array `membros` se a URL da imagem não for undefined
      if (this.url_membro) {
      this.membros.push({ nome: this.nome, imagem: this.url_membro}); 
  }
  this.imageUrl_membro = "";
  this.nome = "";

}
  confirmarDados(){
    if (this.nome != "" && this.enviou_membro == true){
      this.enviou_membro = false
      this.setOpen(false)
      this.salvaMembro()
    }
  }
  selecionarCor(cor: string) {
    this.selectedColor = cor; // Armazena a cor selecionada na variável
    this.setOpen2(false)
  }
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.enviou_membro = false
    this.imageUrl_membro = "";
  }
  
  setOpen2(isOpen: boolean) {
    this.isModalOpen2 = isOpen;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnInit() {
    this.loadimagem()

  }
}