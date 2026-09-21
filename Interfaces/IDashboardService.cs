using MiniERP.API.DTOs;

namespace MiniERP.API.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetSummaryAsync(int? depoId);
    }
}