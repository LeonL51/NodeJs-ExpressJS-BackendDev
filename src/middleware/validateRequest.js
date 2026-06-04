/**
 * Middleware factory that validates req.body against a Zod schema.
 *
 * Usage:
 * router.post("/movies", validateRequest(createMovieSchema), createMovie);
 */
export const validateRequest = (schema) => {
    // Return an Express middleware function
    return (req, res, next) => {
      // Validate the request body against the provided schema
      const result = schema.safeParse(req.body);
  
      if (!result.success) {
        // Group Zod errors by fields 
        const formatted = result.error.format();
  
        // Extract all error messages into a flat array
        const flatErrors = Object.values(formatted)
          .flat() 
          .filter(Boolean) // Remove undefined/null values
          .map((err) => err._errors)
          .flat(); // Flatten again into a single array of strings
  
        // Converts into fully string with errors, separated by commas 
        return res.status(400).json({
          message: flatErrors.join(", "),
        });
      }

      next();
    };
  };