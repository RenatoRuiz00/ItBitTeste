using ItBit.DBContext;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ItBit.Controllers
{
    public class UsuarioApiController : BaseAPIController
    {
        public HttpResponseMessage Get(string nome, string ativo)
        {
            var usuarios = from u in Db.Usuario
                           join s in Db.Sexo on u.SexoId equals s.SexoId
                           select new
                           {
                               UsuarioId = u.UsuarioId,
                               Nome = u.Nome,
                               DataNascimento = u.DataNascimento,
                               Email = u.Email,
                               Senha = u.Senha,
                               Ativo = u.Ativo,
                               SexoId = u.SexoId,
                               Sexo = s.Descricao
                           };


            if (!String.IsNullOrEmpty(ativo) && ativo != "null")
            {
                bool statusAtivo = true;
                if (ativo == "false")
                {
                    statusAtivo = false;
                }
                usuarios = usuarios.Where(x => x.Ativo == statusAtivo);
            }

            if (!String.IsNullOrEmpty(nome) && nome != "null")
            {
                usuarios = usuarios.Where(x => x.Nome.Contains(nome));
            }

            return ToJson(usuarios.AsEnumerable());
        }

        public HttpResponseMessage Post([FromBody] Usuario value)
        {
            value.Ativo = true;
            Db.Usuario.Add(value);
            return ToJson(Db.SaveChanges());
        }

        public HttpResponseMessage Put(int id, [FromBody] Usuario value)
        {
            Db.Entry(value).State = EntityState.Modified;
            return ToJson(Db.SaveChanges());
        }
        public HttpResponseMessage Delete(int id)
        {
            Db.Usuario.Remove(Db.Usuario.FirstOrDefault(x => x.UsuarioId == id));
            return ToJson(Db.SaveChanges());
        }
    }
}
