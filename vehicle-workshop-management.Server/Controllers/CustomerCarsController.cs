using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vehicle_workshop_management.Server.Models;

namespace vehicle_workshop_management.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerCarsController : ControllerBase
    {
        private readonly DBCONTEXT _context;

        public CustomerCarsController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: api/CustomerCars
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerCarDto>>> GetCustomerCars()
        {
        var car = await _context.CustomerCars
            .Include(c => c.Customer)
            .ToListAsync();
            return car.Adapt<List<CustomerCarDto>>();
        }
        [HttpGet("{customerId}/cars")]
        public async Task<ActionResult<IEnumerable<CustomerCarDto>>> GetCustomerCarsByCustomerId(int customerId)
        {
            // Verify customer exists
            if (!await _context.Customers.AnyAsync(c => c.CustomerId == customerId))
            {
                return NotFound("Customer not found");
            }
            var cars = await _context.CustomerCars
                .Where(cc => cc.CustomerId == customerId)
                .Include(c => c.Customer)
                .ToListAsync();
            return cars.Adapt<List<CustomerCarDto>>();
        }

        // GET: api/CustomerCars/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerCarDto>> GetCustomerCar(int id)
        {
            var customerCar = await _context.CustomerCars
                .Include(c => c.Customer)
                .FirstOrDefaultAsync(m => m.CarId == id);

            if (customerCar == null)
                return NotFound();
            var result = customerCar.Adapt<CustomerCarDto>();

            return Ok(result);
        }

        [HttpPost("customers/{customerId}/cars")]
        public async Task<ActionResult<CustomerCarDto>> PostCustomerCar(int customerId, UpdateCustomerCarDto createDto)
        {
            // Verify customer exists
            if (!await _context.Customers.AnyAsync(c => c.CustomerId == customerId))
            {
                return NotFound("Customer not found");
            }
            // 1. Adapt DTO to Entity
            var customerCarEntity = createDto.Adapt<CustomerCar>();
            customerCarEntity.CustomerId = customerId;
            // 2. Add to context and save
            _context.CustomerCars.Add(customerCarEntity);
            await _context.SaveChangesAsync();
            // 3. Adapt Entity back to DTO for response
            var resultDto = customerCarEntity.Adapt<CustomerCarDto>();
            return CreatedAtAction(nameof(GetCustomerCar), new { id = customerCarEntity.CarId }, resultDto);
        }



        // PUT: api/CustomerCars/5
        [HttpPut("/api/customers/{customerId}/cars/{carId}")]
        public async Task<IActionResult> UpdateCustomerCar(int customerId,int carId,[FromBody] UpdateCustomerCarDto updateDto)
        {
            var car = await _context.CustomerCars
                .FirstOrDefaultAsync(c => c.CarId == carId && c.CustomerId == customerId);

            if (car == null) return NotFound();

            updateDto.Adapt(car); 

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/CustomerCars/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomerCar(int id)
        {
            var customerCar = await _context.CustomerCars.FindAsync(id);
            if (customerCar == null)
                return NotFound();

            _context.CustomerCars.Remove(customerCar);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("{carId}/history")]
        public async Task<ActionResult<CarServicesHistoryResponse>> GetServiceHistory(int carId)
        {
            var car = await _context.CustomerCars
                .Include(c => c.Tasks)
                .FirstOrDefaultAsync(c => c.CarId == carId);

            if (car == null)
            {
                return NotFound("Vehicle not found");
            }

            return new CarServicesHistoryResponse
            {
                CarId = car.CarId,
                Make = car.Make,
                Model = car.Model,
                LicensePlate = car.LicensePlate,
                History = car.Tasks
                    .OrderByDescending(t => t.StartTime)
                    .Adapt<List<ServiceHistoryDto>>()
            };
        }
        private bool CustomerCarExists(int id)
        {
            return _context.CustomerCars.Any(e => e.CarId == id);
        }
    }
}
