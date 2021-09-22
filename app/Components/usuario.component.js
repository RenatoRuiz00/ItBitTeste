"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioComponent = void 0;
var core_1 = require("@angular/core");
var usuario_service_1 = require("../Service/usuario.service");
var sexo_service_1 = require("../Service/sexo.service");
var forms_1 = require("@angular/forms");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var enum_1 = require("../Shared/enum");
var global_1 = require("../Shared/global");
var UsuarioComponent = /** @class */ (function () {
    function UsuarioComponent(fb, _userService, _sexoService) {
        this.fb = fb;
        this._userService = _userService;
        this._sexoService = _sexoService;
        this.indLoading = false;
    }
    UsuarioComponent.prototype.ngOnInit = function () {
        this.userFrm = this.fb.group({
            UsuarioId: [''],
            Nome: ['', forms_1.Validators.required],
            DataNascimento: ['', forms_1.Validators.required],
            Email: ['', forms_1.Validators.required],
            Senha: ['', forms_1.Validators.required],
            Ativo: ['true', forms_1.Validators.required],
            SexoId: ['', forms_1.Validators.required],
            Sexo: ['']
        });
        this.buscarFrm = this.fb.group({
            Nome: [''],
            Ativo: ['']
        });
        this.LoadUsers('', '');
        this.LoadSexos();
    };
    UsuarioComponent.prototype.LoadUsers = function (nome, ativo) {
        var _this = this;
        this.indLoading = true;
        this._userService.get(global_1.Global.BASE_USER_ENDPOINT + '?nome=' + nome + '&ativo=' + ativo)
            .subscribe(function (users) { _this.usuarios = users; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    UsuarioComponent.prototype.LoadSexos = function () {
        var _this = this;
        this.indLoading = true;
        this._sexoService.get('api/sexoapi/')
            .subscribe(function (sexos) { _this.sexos = sexos; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    UsuarioComponent.prototype.addUser = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Novo Usuário";
        this.modalBtnTitle = "Salvar";
        this.userFrm.reset();
        this.userFrm.controls['Ativo'].disable();
        this.modal.open();
    };
    UsuarioComponent.prototype.editUser = function (id) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Editar Usuário";
        this.modalBtnTitle = "Editar";
        this.usuario = this.usuarios.filter(function (x) { return x.UsuarioId == id; })[0];
        this.userFrm.setValue(this.usuario);
        this.dtNascimento = this.formatDate(this.usuario.DataNascimento);
        this.modal.open();
    };
    UsuarioComponent.prototype.deleteUser = function (id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Deseja realmente deletar?";
        this.modalBtnTitle = "Deletar";
        this.usuario = this.usuarios.filter(function (x) { return x.UsuarioId == id; })[0];
        this.userFrm.setValue(this.usuario);
        this.dtNascimento = this.formatDate(this.usuario.DataNascimento);
        this.modal.open();
    };
    UsuarioComponent.prototype.alterarAtivo = function (id) {
        var _this = this;
        this.usuario = this.usuarios.filter(function (x) { return x.UsuarioId == id; })[0];
        this.usuario.Ativo = !this.usuario.Ativo;
        this._userService.put(global_1.Global.BASE_USER_ENDPOINT, id, this.usuario).subscribe(function (data) {
            if (data == 1) //Success    
             {
                _this.msg = "Usuário atualizado!";
                _this.LoadUsers('', '');
            }
            else {
                _this.msg = "Não foi possível atualizar o usuário!";
            }
        }, function (error) {
            _this.msg = error;
        });
    };
    UsuarioComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
    };
    UsuarioComponent.prototype.formatDate = function (date) {
        var d = new Date(date);
        var month = '' + (d.getMonth() + 1);
        var day = '' + d.getDate();
        var year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [year, month, day].join('-');
    };
    UsuarioComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        switch (this.dbops) {
            case enum_1.DBOperation.create:
                this._userService.post(global_1.Global.BASE_USER_ENDPOINT, formData._value).subscribe(function (data) {
                    if (data == 1) //Success    
                     {
                        _this.msg = "Dados salvos!";
                        _this.LoadUsers('', '');
                    }
                    else {
                        _this.msg = "Não foi possível criar o novo usuário!";
                    }
                    _this.modal.dismiss();
                }, function (error) {
                    _this.msg = error;
                });
                break;
            case enum_1.DBOperation.update:
                this._userService.put(global_1.Global.BASE_USER_ENDPOINT, formData._value.UsuarioId, formData._value).subscribe(function (data) {
                    if (data == 1) //Success    
                     {
                        _this.msg = "Usuário atualizado!";
                        _this.LoadUsers('', '');
                    }
                    else {
                        _this.msg = "Não foi possível atualizar o usuário!";
                    }
                    _this.dtNascimento = "";
                    _this.modal.dismiss();
                }, function (error) {
                    _this.msg = error;
                });
                break;
            case enum_1.DBOperation.delete:
                this._userService.delete(global_1.Global.BASE_USER_ENDPOINT, formData._value.UsuarioId).subscribe(function (data) {
                    if (data == 1) //Success    
                     {
                        _this.msg = "Usuário Deletado!";
                        _this.LoadUsers('', '');
                    }
                    else {
                        _this.msg = "Ocorreu um erro ao deletar o usuário!";
                    }
                    _this.dtNascimento = "";
                    _this.modal.dismiss();
                }, function (error) {
                    _this.msg = error;
                });
                break;
        }
    };
    UsuarioComponent.prototype.onBuscar = function (formData) {
        this.LoadUsers(formData._value.Nome, formData._value.Ativo);
        this.buscarFrm.reset();
    };
    __decorate([
        core_1.ViewChild('modal'),
        __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
    ], UsuarioComponent.prototype, "modal", void 0);
    UsuarioComponent = __decorate([
        core_1.Component({
            selector: 'user-app',
            templateUrl: '/app/Components/usuario.component.html'
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, usuario_service_1.UsuarioService, sexo_service_1.SexoService])
    ], UsuarioComponent);
    return UsuarioComponent;
}());
exports.UsuarioComponent = UsuarioComponent;
//# sourceMappingURL=usuario.component.js.map