using System.ComponentModel.DataAnnotations;
using JobApplicationTracker.WebApi.Models;

namespace JobApplicationTracker.WebApi.DTOs
{
    /// <summary>
    /// Data transfer object for updating an existing job application
    /// </summary>
    /// <param name="CompanyName">Name of the company (required, max 200 characters)</param>
    /// <param name="Position">Job position title (required, max 200 characters)</param>
    /// <param name="Status">Updated status of the application (required). Note: DateApplied cannot be updated.</param>
    public record UpdateJobApplicationDto(
        /// <summary>
        /// Name of the company
        /// </summary>
        [property: Required(ErrorMessage = "Company name is required")]
        [property: MaxLength(200, ErrorMessage = "Company name cannot exceed 200 characters")]
        string CompanyName,

        /// <summary>
        /// Job position title
        /// </summary>
        [property: Required(ErrorMessage = "Position is required")]
        [property: MaxLength(200, ErrorMessage = "Position cannot exceed 200 characters")]
        string Position,

        /// <summary>
        /// Updated status of the application. Valid values: Applied (1), Interview (2), Offer (3), Rejected (4), Accepted (5)
        /// </summary>
        [property: Required(ErrorMessage = "Status is required")]
        [property: EnumDataType(typeof(JobApplicationStatus), ErrorMessage = "Invalid status value")]
        JobApplicationStatus Status
    );
}
