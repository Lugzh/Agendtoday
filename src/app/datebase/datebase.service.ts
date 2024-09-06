import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; // Importa o módulo Firebase compatível
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatebaseService {
  

  constructor(private firestore: AngularFirestore ) {
    
  }
  id: any;
  id1: any;
  async saveCadastroData(cadastroData: any) {
    try {
      console.log(cadastroData)
      //this.id = await this.firestore.collection('cadastro').add
      const docRef = this.firestore.collection('cadastro').doc(cadastroData.cnpj);

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


  docSnapshot: any
  cnpj_usuario:any;
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
