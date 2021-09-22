import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../Service/usuario.service';
import { SexoService } from '../Service/sexo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { IUsuario } from '../Models/Usuario';
import { ISexo } from '../Models/Sexo';
import { DBOperation } from '../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../Shared/global';


@Component({
    selector: 'user-app',
    templateUrl: '/app/Components/usuario.component.html'
})

export class UsuarioComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;

    sexos: ISexo[];
    usuarios: IUsuario[];
    usuario: IUsuario;
    msg: string;
    indLoading: boolean = false;
    userFrm: FormGroup;
    buscarFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    dtNascimento: string;

    constructor(private fb: FormBuilder, private _userService: UsuarioService, private _sexoService: SexoService) { }

    ngOnInit(): void {
        this.userFrm = this.fb.group({
            UsuarioId: [''],
            Nome: ['', Validators.required],
            DataNascimento: ['', Validators.required],
            Email: ['', Validators.required],
            Senha: ['', Validators.required],
            Ativo: ['true', Validators.required],
            SexoId: ['', Validators.required],
            Sexo: ['']
        });

        this.buscarFrm = this.fb.group({
            Nome: [''],
            Ativo: ['']
        });

        this.LoadUsers('', '');
        this.LoadSexos();
    }

    LoadUsers(nome: string, ativo: string): void {
        this.indLoading = true;
        this._userService.get(Global.BASE_USER_ENDPOINT + '?nome=' + nome + '&ativo=' + ativo)
            .subscribe(users => { this.usuarios = users; this.indLoading = false; },
                error => this.msg = <any>error);
    }

    LoadSexos(): void {
        this.indLoading = true;
        this._sexoService.get('api/sexoapi/')
            .subscribe(sexos => { this.sexos = sexos; this.indLoading = false; },
                error => this.msg = <any>error);
    }

    addUser() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Novo Usuário";
        this.modalBtnTitle = "Salvar";
        this.userFrm.reset();
        this.userFrm.controls['Ativo'].disable();

        this.modal.open();
    }

    editUser(id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Editar Usuário";
        this.modalBtnTitle = "Editar";
        this.usuario = this.usuarios.filter(x => x.UsuarioId == id)[0];
        this.userFrm.setValue(this.usuario);
        this.dtNascimento = this.formatDate(this.usuario.DataNascimento);
        this.modal.open();
    }

    deleteUser(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Deseja realmente deletar?";
        this.modalBtnTitle = "Deletar";
        this.usuario = this.usuarios.filter(x => x.UsuarioId == id)[0];
        this.userFrm.setValue(this.usuario);
        this.dtNascimento = this.formatDate(this.usuario.DataNascimento);
        this.modal.open();
    }

    alterarAtivo(id: number) {
        this.usuario = this.usuarios.filter(x => x.UsuarioId == id)[0];
        this.usuario.Ativo = !this.usuario.Ativo;
        this._userService.put(Global.BASE_USER_ENDPOINT, id, this.usuario).subscribe(data => {
            if (data == 1) //Success    
            {
                this.msg = "Usuário atualizado!";
                this.LoadUsers('', '');
            } else {
                this.msg = "Não foi possível atualizar o usuário!"
            }
        }, error => {
            this.msg = error;
        });
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
    }

    private formatDate(date: Date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    }

    onSubmit(formData: any) {
        this.msg = "";
        switch (this.dbops) {
            case DBOperation.create:
                this._userService.post(Global.BASE_USER_ENDPOINT, formData._value).subscribe(data => {
                    if (data == 1) //Success    
                    {
                        this.msg = "Dados salvos!";
                        this.LoadUsers('', '');
                    } else {
                        this.msg = "Não foi possível criar o novo usuário!"
                    }
                    this.modal.dismiss();
                }, error => {
                    this.msg = error;
                });
                break;
            case DBOperation.update:
                this._userService.put(Global.BASE_USER_ENDPOINT, formData._value.UsuarioId, formData._value).subscribe(data => {
                    if (data == 1) //Success    
                    {
                        this.msg = "Usuário atualizado!";
                        this.LoadUsers('', '');
                    } else {
                        this.msg = "Não foi possível atualizar o usuário!"
                    }
                    this.dtNascimento = "";
                    this.modal.dismiss();
                }, error => {
                    this.msg = error;
                });
                break;
            case DBOperation.delete:
                this._userService.delete(Global.BASE_USER_ENDPOINT, formData._value.UsuarioId).subscribe(data => {
                    if (data == 1) //Success    
                    {
                        this.msg = "Usuário Deletado!";
                        this.LoadUsers('', '');
                    } else {
                        this.msg = "Ocorreu um erro ao deletar o usuário!"
                    }
                    this.dtNascimento = "";
                    this.modal.dismiss();
                }, error => {
                    this.msg = error;
                });
                break;
        }
    }

    onBuscar(formData: any) {
        this.LoadUsers(formData._value.Nome, formData._value.Ativo);
        this.buscarFrm.reset();
    }



}
