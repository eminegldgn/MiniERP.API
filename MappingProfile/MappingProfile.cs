using AutoMapper;
using MiniERP.API.DTOs;
using MiniERP.API.Models;

namespace MiniERP.API
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductDto>()
                .ForMember(
                    dest => dest.Name,
                    opt => opt.MapFrom(src => src.ProductName)
                )
                .ForMember(
                    dest => dest.Code,
                    opt => opt.MapFrom(src => src.ProductCode)
                )
                .ForMember(
                    dest => dest.Price,
                    opt => opt.MapFrom(src => src.UnitPrice)
                )
                .ForMember(
                    dest => dest.Stock,
                    opt => opt.MapFrom(src => src.StockQuantity)
                )
                .ForMember(
                    dest => dest.MinStockQuantity,
                    opt => opt.MapFrom(src => src.MinimumStock)
                )
                .ForMember(
                    dest => dest.DepoId,
                    opt => opt.MapFrom(src => src.DepoId)
                );


            CreateMap<CreateProductDto, Product>()
                .ForMember(
                    dest => dest.ProductName,
                    opt => opt.MapFrom(src => src.Name)
                )
                .ForMember(
                    dest => dest.ProductCode,
                    opt => opt.MapFrom(src => src.Code)
                )
                .ForMember(
                    dest => dest.UnitPrice,
                    opt => opt.MapFrom(src => src.Price)
                )
                .ForMember(
                    dest => dest.StockQuantity,
                    opt => opt.MapFrom(src => src.Stock)
                )
                .ForMember(
                    dest => dest.MinimumStock,
                    opt => opt.MapFrom(src => src.MinStockQuantity)
                )
                .ForMember(
                    dest => dest.DepoId,
                    opt => opt.MapFrom(src => src.DepoId)
                );


            CreateMap<ProductDto, Product>()
                .ForMember(
                    dest => dest.ProductName,
                    opt => opt.MapFrom(src => src.Name)
                )
                .ForMember(
                    dest => dest.ProductCode,
                    opt => opt.MapFrom(src => src.Code)
                )
                .ForMember(
                    dest => dest.UnitPrice,
                    opt => opt.MapFrom(src => src.Price)
                )
                .ForMember(
                    dest => dest.StockQuantity,
                    opt => opt.MapFrom(src => src.Stock)
                )
                .ForMember(
                    dest => dest.MinimumStock,
                    opt => opt.MapFrom(src => src.MinStockQuantity)
                )
                .ForMember(
                    dest => dest.DepoId,
                    opt => opt.MapFrom(src => src.DepoId)
                );
            CreateMap<PurchaseRequest, PurchaseRequestDto>()
                .ForMember(
                    dest => dest.ItemName,
                    opt => opt.MapFrom(
                        src => src.Product != null
                            ? src.Product.ProductName
                            : string.Empty
                    )
                );

            CreateMap<CreatePurchaseRequestDto, PurchaseRequest>();

            CreateMap<PurchaseRequestDto, PurchaseRequest>();

            CreateMap<Order, OrderDto>();

            CreateMap<CreateOrderDto, Order>();

            CreateMap<OrderDto, Order>();
        }
    }
}