using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vehicle_workshop_management.Server.Models;

namespace vehicle_workshop_management.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoriesController : ControllerBase
    {
        private readonly DBCONTEXT _context;

        public InventoriesController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: api/Inventories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventoryDto>>> GetInventories()
        {
            var inventory = await _context.Inventories
        .Include(i => i.InventoryGroupItems)
            .ThenInclude(igi => igi.Group) // Include Group info
        .ToListAsync();

            var res = inventory.Adapt<List<InventoryDto>>();
            return Ok(res);

        }

        // GET: api/Inventories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InventoryDto>> GetInventory(int id)
        {
            var inventory = await _context.Inventories.FindAsync(id);

            if (inventory == null)
                return NotFound();

            return inventory.Adapt<InventoryDto>();
        }

        // POST: api/Inventories
        [HttpPost]
        public async Task<ActionResult<InventoryDto>> CreateInventoryItem(CreateInventoryItem inventoryDto)
        {
            var item = inventoryDto.Adapt<Inventory>();
            _context.Inventories.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInventory), new { id = item.InventoryId }, item.Adapt<InventoryDto>());
        }

        // PUT: api/Inventories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInventory(int id, Inventory inventory)
        {
            if (id != inventory.InventoryId)
                return BadRequest();

            _context.Entry(inventory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InventoryExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }
        // POST: api/Inventories/AssignToGroup
        [HttpPost("AssignToGroup")]
        public async Task<ActionResult> AssignInventoryToGroup(AssignInventoryToGroupDto assignmentDto)
        {
            // Check if inventory item exists
            var inventoryItem = await _context.Inventories
                .FindAsync(assignmentDto.InventoryId);

            if (inventoryItem == null)
            {
                return NotFound($"Inventory item with ID {assignmentDto.InventoryId} not found");
            }

            // Check if group exists
            var group = await _context.InventoryGroups
                .FindAsync(assignmentDto.GroupId);

            if (group == null)
            {
                return NotFound($"Group with ID {assignmentDto.GroupId} not found");
            }

            // Check if the relationship already exists
            var existingAssignment = await _context.InventoryGroupItems
                .FirstOrDefaultAsync(igi => igi.InventoryId == assignmentDto.InventoryId
                                        && igi.GroupId == assignmentDto.GroupId);

            if (existingAssignment != null)
            {
                return BadRequest("This inventory item is already assigned to this group");
            }

            // Create the new relationship
            var newAssignment = new InventoryGroupItem
            {
                InventoryId = assignmentDto.InventoryId,
                GroupId = assignmentDto.GroupId
            };

            _context.InventoryGroupItems.Add(newAssignment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // GET: api/Inventories/{id}/Groups
        [HttpGet("{id}/Groups")]
        public async Task<ActionResult<IEnumerable<InventoryGroupDto>>> GetInventoryGroups(int id)
        {
            var inventoryItem = await _context.Inventories
                .Include(i => i.InventoryGroupItems)
                .ThenInclude(igi => igi.Group)
                .FirstOrDefaultAsync(i => i.InventoryId == id);

            if (inventoryItem == null)
            {
                return NotFound();
            }

            var groupDtos = inventoryItem.InventoryGroupItems
                .Select(igi => igi.Group.Adapt<InventoryGroupDto>())
                .ToList();

            return Ok(groupDtos);
        }
        // DELETE: api/Inventories/{inventoryId}/Groups/{groupId}
        [HttpDelete("{inventoryId}/Groups/{groupId}")]
        public async Task<IActionResult> RemoveInventoryFromGroup(int inventoryId, int groupId)
        {
            var assignment = await _context.InventoryGroupItems
                .FirstOrDefaultAsync(igi => igi.InventoryId == inventoryId && igi.GroupId == groupId);

            if (assignment == null)
            {
                return NotFound();
            }

            _context.InventoryGroupItems.Remove(assignment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // DELETE: api/Inventories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInventory(int id)
        {
            var inventory = await _context.Inventories.FindAsync(id);
            if (inventory == null)
                return NotFound();

            _context.Inventories.Remove(inventory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InventoryExists(int id)
        {
            return _context.Inventories.Any(e => e.InventoryId == id);
        }
    }
}
