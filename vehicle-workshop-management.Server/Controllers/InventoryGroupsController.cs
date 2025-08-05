using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using vehicle_workshop_management.Server.Models;

namespace vehicle_workshop_management.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryGroupsController : ControllerBase
    {
        private readonly DBCONTEXT _context;

        public InventoryGroupsController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: api/InventoryGroups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventoryGroupDto>>> GetInventoryGroups()
        {
            var group = await _context.InventoryGroups.ToListAsync();
            return group.Adapt<List<InventoryGroupDto>>();
        }

        // GET: api/InventoryGroups/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InventoryGroupDto>> GetInventoryGroup(int id)
        {
            var inventoryGroup = await _context.InventoryGroups.Include(ig => ig.InventoryGroupItems).FirstOrDefaultAsync( ig => ig.GroupId ==  id);

            if (inventoryGroup == null)
            {
                return NotFound();
            }
            var res = inventoryGroup.Adapt<InventoryGroupDto>();
            return res;
        }

        // POST: api/InventoryGroups
        [HttpPost]
        public async Task<ActionResult<InventoryGroupDto>> PostInventoryGroup(UpdateInventoryGroupDto inventoryGroupDto)
        {
            var group = inventoryGroupDto.Adapt<InventoryGroup>();
            _context.InventoryGroups.Add(group);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInventoryGroup), new { id = group.GroupId }, group.Adapt<InventoryGroupDto>());
        }

        // PUT: api/InventoryGroups/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInventoryGroup(int id, UpdateInventoryGroupDto inventoryGroupDto)
        {
            var inventoryGroup = await _context.InventoryGroups.FindAsync(id);
            if (inventoryGroup == null)
            {
                return NotFound();
            }
            inventoryGroupDto.Adapt(inventoryGroup);
            _context.Entry(inventoryGroup).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InventoryGroupExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/InventoryGroups/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInventoryGroup(int id)
        {
            var inventoryGroup = await _context.InventoryGroups.FindAsync(id);
            if (inventoryGroup == null)
            {
                return NotFound();
            }

            _context.InventoryGroups.Remove(inventoryGroup);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InventoryGroupExists(int id)
        {
            return _context.InventoryGroups.Any(e => e.GroupId == id);
        }
    }
}