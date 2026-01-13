/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';
import { parseJsonInput, validateBulkLimits } from '../../utils';

export async function bulkUpdate(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const companiesInput = this.getNodeParameter('companies', index) as string | IDataObject[];

  let companies: IDataObject[];

  if (typeof companiesInput === 'string') {
    const parsed = parseJsonInput(companiesInput);
    companies = Array.isArray(parsed) ? parsed : [parsed];
  } else {
    companies = Array.isArray(companiesInput) ? companiesInput : [companiesInput];
  }

  validateBulkLimits(companies);

  const body = {
    companies: companies.map((company) => ({
      company_id: company.company_id || company.companyId,
      ...company,
    })),
  };

  const response = await userPilotApiRequest.call(this, 'POST', '/v1/companies/bulk', body);

  return [
    {
      json: {
        success: true,
        total_companies: companies.length,
        ...response,
      },
    },
  ];
}
