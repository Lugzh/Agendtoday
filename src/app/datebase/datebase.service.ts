import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; // Importa o módulo Firebase compatível
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/compat/storage';


@Injectable({
  providedIn: 'root'
})
export class DatebaseService {

  constructor(private firestore: AngularFirestore, private http: HttpClient,private storage: AngularFireStorage ) {
    
  }
  id: any;
  id1: any;
  cnpj_usuario:any;
  async saveCadastroData(cadastroData: any) {
    try {
      //this.id = await this.firestore.collection('cadastro').add
      const docRef = this.firestore.collection('cadastro').doc(cadastroData.cnpj);

      this.firestore.collection('empresa').doc(cadastroData.cnpj).set({
      });
      this.firestore.collection('cliente').doc(cadastroData.cnpj).set({
      });

      await docRef.set({
        id:cadastroData.cnpj,
        nomeResponsavel: cadastroData.nomeResponsavel,
        cnpj: cadastroData.cnpj,
        email: cadastroData.email,
        cep: cadastroData.cep,
        numero: cadastroData.numero,
        cidade: cadastroData.cidade,
        enderecoFisico: cadastroData.enderecoFisico,
        bairro: cadastroData.bairro,
        senha: cadastroData.senha,
        confirmarSenha: cadastroData.confirmarSenha,
        datetime: new Date()
      });
      console.log('Cadastro realizado com sucesso!', );
    } catch (error) {
      console.error('Error adding document: ', error);
      throw error;
    }
  }


  async getHorarios(): Promise<any> {
    try {
      const docRef = this.firestore.collection('horarios').doc(this.cnpj_usuario);
      const docSnapshot = await docRef.get().toPromise();
      
      if (docSnapshot && docSnapshot.exists) { // Verificação adicional para garantir que docSnapshot não é undefined
        return docSnapshot.data();
      } else {
        console.log('Nenhum horário encontrado para o CNPJ fornecido.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      throw error;
    }
  }

  async uploadImagedono(imagePath: any): Promise<string> {
    // Converte a imagem para Blob
    return new Promise((resolve, reject) => {
      this.http.get(imagePath, { responseType: 'blob' }).subscribe(
        (blob) => {
          const filePath = `images/${new Date().getTime()}_image.jpg`; // Define o caminho no Firebase Storage
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, blob);
  
          // Acompanhar o progresso do upload e obter o URL da imagem
          task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                fileRef.getDownloadURL().subscribe(
                  async (url) => {
                    try {
                      // Agora que temos o URL da imagem, vamos salvar no Firestore no documento especificado
                      await this.firestore.collection('empresa').doc(this.cnpj_usuario).set({
                        Urldono: url, // URL da imagem
                      });
  
                      console.log(`Imagem salva no Firestore no documento ${this.cnpj_usuario} com sucesso!`);
  
                      resolve(url); // Retorna o URL da imagem
                    } catch (error) {
                      console.error('Erro ao salvar no Firestore:', error);
                      reject(error);
                    }
                  },
                  (error) => {
                    reject(error); // Lida com erros ao obter o URL
                  }
                );
              })
            )
            .subscribe();
        },
        (error) => {
          reject(error); // Lida com erros ao obter o Blob da imagem
        }
      );
    });
  }
  async adicionarMembros(membros: any) {
    try {
      await this.firestore.collection('empresa').doc(this.cnpj_usuario).update({
        membros: membros
      });
      console.log('Membros adicionados com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar membros:', error);
    }
  }

  async salvaNomeEmpresa(nome: string,cor:string) {//salva o nome da empresa e tambem a cor da margem
    try {
      await this.firestore.collection('empresa').doc(this.cnpj_usuario).update({
        nome: nome,
        cor: cor
      });
      console.log('Membros adicionados com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar membros:', error);
    }
  }

  async uploadImagemembro(imagePath: string): Promise<string> {//só upa a imagem do membro na nuvem
    // Converte a imagem para Blob
    return new Promise((resolve, reject) => {
      this.http.get(imagePath, { responseType: 'blob' }).subscribe(
        (blob) => {
          const filePath = `images/${new Date().getTime()}_image.jpg`; // Define o caminho no Firebase Storage
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, blob);
  
          // Acompanhar o progresso do upload e obter o URL da imagem
          task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                fileRef.getDownloadURL().subscribe(
                  (url) => {
                    resolve(url); // Retorna o URL da imagem após o upload ser concluído
                  },
                  (error) => {
                    reject(error); // Lida com erros ao obter o URL
                  }
                );
              })
            )
            .subscribe();
        },
        (error) => {
          reject(error); // Lida com erros ao obter o Blob da imagem
        }
      );
    });
  }


  async getImage(): Promise<any> {
    try {
      const docRef = this.firestore.collection('empresa').doc(this.cnpj_usuario);
      const docSnapshot = await docRef.get().toPromise();
      
      if (docSnapshot && docSnapshot.exists) { // Verificação adicional para garantir que docSnapshot não é undefined
        return docSnapshot.data();
      } else {
        console.log('Nenhum horário encontrado para o CNPJ fornecido.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      throw error;
    }
  }

  
  async getagendamento(): Promise<any> {
    try {
      const docRef = this.firestore.collection('cliente').doc(this.cnpj_usuario);
      const docSnapshot = await docRef.get().toPromise();
      
      if (docSnapshot && docSnapshot.exists) { // Verificação adicional para garantir que docSnapshot não é undefined
        return docSnapshot.data();
      } else {
        console.log('Nenhum agendamento encontrado para o CNPJ fornecido.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      throw error;
    }
  }


  docSnapshot: any
  async verifyCnpjAndPassword(cnpj: string, senha: string): Promise<boolean> {

    try {
      const docRef = this.firestore.collection('cadastro').doc(cnpj);
      this.docSnapshot = await docRef.get().toPromise();
      if (this.docSnapshot.exists) {
        const data = this.docSnapshot.data();
        if (data?.senha === senha) {
          this.cnpj_usuario = cnpj
          console.log('CNPJ e senha verificados com sucesso!');
          return true;  // Senha e CNPJ correspondem
        } else {
          console.log('Senha incorreta.');
          return false;  // Senha não corresponde
        }
      } else {
        console.log('CNPJ não encontrado.');
        return false;  // CNPJ não encontrado
      }
    } catch (error) {
      console.error('Error verifying CNPJ and password: ', error);
      throw error;
    }
  }
  async saveServicos(servicosData: any) {
    try {
      //this.id = await this.firestore.collection('cadastro').add
      const docRef = this.firestore.collection('servico').doc(this.cnpj_usuario);

      await docRef.set(
        {
          servicos: firebase.firestore.FieldValue.arrayUnion({
            nome: servicosData.nome_servico,
            tempo: servicosData.tempo,
          })
        },
        { merge: true } // Garante que os novos serviços sejam adicionados ao array existente
      );
      console.log('Cadastro realizado com sucesso!', );
    } catch (error) {
      console.error('Error adding document: ', error);
      throw error;
    }
  }
  async saveHorarios(Horarios: any, dias: any) {
    try {
      // Adiciona um novo documento com uma chave aleatória gerada automaticamente
      const docRef = this.firestore.collection('horarios').doc(this.cnpj_usuario);
      await docRef.set({
        horários: Horarios,
        dias: dias,
      });
      
      console.log('Cadastro realizado com sucesso! ID do documento: ');
    } catch (error) {
      console.error('Error adding document: ', error);
      throw error;
    }
  }
  remover:any
  async removeServico(nomeServico: string): Promise<void> {
    try {
      const docRef = this.firestore.collection('servico').doc(this.cnpj_usuario);

      // Obtém o documento atual
      this.remover = await docRef.get().toPromise();

      if (this.remover.exists) {
        const data = this.remover.data();
        if (data && data.servicos) {
          // Filtra o array para remover o serviço com o nome específico
          const novosServicos = data.servicos.filter((servico: any) => servico.nome !== nomeServico);

          // Atualiza o documento com o novo array
          await docRef.update({
            servicos: novosServicos
          });

          console.log('Serviço removido com sucesso!');
        } else {
          console.log('Nenhum serviço encontrado para remover.');
        }
      } else {
        console.log('Documento não encontrado.');
      }
    } catch (error) {
      console.error('Error removing service: ', error);
      throw error;
    }
  }
  
 

  async getServicosByCnpj(): Promise<any> {
    try {
      const docRef = this.firestore.collection('servico').doc(this.cnpj_usuario);
      const docSnapshot = await docRef.get().toPromise();
      
      if (docSnapshot && docSnapshot.exists) { // Verificação adicional para garantir que docSnapshot não é undefined
        return docSnapshot.data();
      } else {
        console.log('Nenhum horário encontrado para o CNPJ fornecido.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      throw error;
    }
  }

}
