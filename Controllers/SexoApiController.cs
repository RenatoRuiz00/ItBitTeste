using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using ItBit.DBContext;

namespace ItBit.Controllers
{
    public class SexoApiController : BaseAPIController
    {
        private bd_itbitEntities db = new bd_itbitEntities();

        // GET: api/Sexo
        public IQueryable<Sexo> GetSexo()
        {
            return db.Sexo;
        }

        // GET: api/Sexo/5
        [ResponseType(typeof(Sexo))]
        public async Task<IHttpActionResult> GetSexo(int id)
        {
            Sexo sexo = await db.Sexo.FindAsync(id);
            if (sexo == null)
            {
                return NotFound();
            }

            return Ok(sexo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SexoExists(int id)
        {
            return db.Sexo.Count(e => e.SexoId == id) > 0;
        }
    }
}