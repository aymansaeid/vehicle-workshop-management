using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vehicle_workshop_management.Server.Models;

namespace vehicle_workshop_management.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryGroupItemsController : ControllerBase
    {
        private readonly DBCONTEXT _context;

        public InventoryGroupItemsController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: api/InventoryGroupItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventoryGroupItem>>> GetInventoryGroupItems()
        {
            return await _context.InventoryGroupItems
                .Include(i => i.Group)
                .Include(i => i.Inventory)
                .ToListAsync();
        }

        // GET: api/InventoryGroupItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InventoryGroupItem>> GetInventoryGroupItem(int id)
        {
            var inventoryGroupItem = await _context.InventoryGroupItems
                .Include(i => i.Group)
                .Include(i => i.Inventory)
                .FirstOrDefaultAsync(m => m.InventoryId == id);

            if (inventoryGroupItem == null)
            {
                return NotFound();
            }

            return inventoryGroupItem;
        }

        // POST: api/InventoryGroupItems
        [HttpPost]
        public async Task<ActionResult<InventoryGroupItem>> PostInventoryGroupItem(InventoryGroupItem inventoryGroupItem)
        {
            _context.InventoryGroupItems.Add(inventoryGroupItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInventoryGroupItem), new { id = inventoryGroupItem.InventoryId }, inventoryGroupItem);
        }

        // PUT: api/InventoryGroupItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInventoryGroupItem(int id, InventoryGroupItem inventoryGroupItem)
        {
            if (id != inventoryGroupItem.InventoryId)
            {
                return BadRequest();
            }

            _context.Entry(inventoryGroupItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InventoryGroupItemExists(id))
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

        // DELETE: api/InventoryGroupItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInventoryGroupItem(int id)
        {
            var inventoryGroupItem = await _context.InventoryGroupItems.FindAsync(id);
            if (inventoryGroupItem == null)
            {
                return NotFound();
            }

            _context.InventoryGroupItems.Remove(inventoryGroupItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InventoryGroupItemExists(int id)
        {
            return _context.InventoryGroupItems.Any(e => e.InventoryId == id);
        }
    }
}