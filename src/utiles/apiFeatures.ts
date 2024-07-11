class ApiFeatures {
  query: any;
  queryString: any;
  paginationResult: any;
    static mock: any;

  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.where = JSON.parse(queryStr);
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",");
      this.query = {
        ...this.query,
        attributes: fields,
      };
    } else {
      this.query = {
        ...this.query,
        attributes: { exclude: ["__v"] },
      };
    }
    return this;
  }

  async paginate(totalDocuments: number) {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 50;
    const offset = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination result
    const pagination: any = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(totalDocuments / limit);

    // Next page
    if (endIndex < totalDocuments) {
      pagination.next = page + 1;
    }
    // Previous page
    if (offset > 0) {
      pagination.prev = page - 1;
    }

    this.query = {
      ...this.query,
      offset: offset,
      limit: limit,
    };
    this.paginationResult = pagination;
    return this;
  }
}

export default ApiFeatures;
