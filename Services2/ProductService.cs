using AutoMapper;
using MiniERP.API.DTOs;
using MiniERP.API.Interfaces;
using MiniERP.API.Models;

namespace MiniERP.API.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;
        private readonly IMapper _mapper;

        public ProductService(
            IProductRepository repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<List<ProductDto>> GetAllAsync()
        {
            var products =
                await _repository.GetAllAsync();

            return _mapper.Map<List<ProductDto>>(
                products
            );
        }

        public async Task<ProductDto?> GetByIdAsync(
            int id
        )
        {
            var product =
                await _repository.GetByIdAsync(id);

            if (product == null)
            {
                return null;
            }

            return _mapper.Map<ProductDto>(
                product
            );
        }

        public async Task<List<ProductDto>> GetCriticalProductsAsync()
        {
            var products =
                await _repository.GetAllAsync();

            var criticalProducts =

                products.Where(
                    p =>
                        p.StockQuantity <=
                        p.MinimumStock
                );


            return _mapper.Map<List<ProductDto>>(
                criticalProducts
            );
        }
        public async Task<ProductDto> AddAsync(
            CreateProductDto createProductDto
        )
        {
            var product =
                _mapper.Map<Product>(
                    createProductDto
                );


            await _repository.AddAsync(
                product
            );


            return _mapper.Map<ProductDto>(
                product
            );
        }
        public async Task UpdateAsync(
            int id,
            ProductDto productDto
        )
        {
            var existingProduct =
                await _repository.GetByIdAsync(id);


            if (existingProduct == null)
            {
                return;
            }
            _mapper.Map(
                productDto,
                existingProduct
            );


            await _repository.UpdateAsync(
                existingProduct
            );
        }
        public async Task DeleteAsync(
            int id
        )
        {
            var product =
                await _repository.GetByIdAsync(id);


            if (product == null)
            {
                return;
            }


            await _repository.DeleteAsync(
                product
            );
        }
    }
}