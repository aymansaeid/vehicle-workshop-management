using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public async Task<ActionResult<IEnumerable<InventoryGroup>>> GetInventoryGroups()
        {
            return await _context.InventoryGroups.ToListAsync();
        }

        // GET: api/InventoryGroups/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InventoryGroup>> GetInventoryGroup(int id)
        {
            var inventoryGroup = await _context.InventoryGroups.FindAsync(id);

            if (inventoryGroup == null)
            {
                return NotFound();
            }

            return inventoryGroup;
        }

        // POST: api/InventoryGroups
        [HttpPost]
        public async Task<ActionResult<InventoryGroup>> PostInventoryGroup(InventoryGroup inventoryGroup)
        {
            _context.InventoryGroups.Add(inventoryGroup);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInventoryGroup), new { id = inventoryGroup.GroupId }, inventoryGroup);
        }

        // PUT: api/InventoryGroups/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInventoryGroup(int id, InventoryGroup inventoryGroup)
        {
            if (id != inventoryGroup.GroupId)
            {
                return BadRequest();
            }

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