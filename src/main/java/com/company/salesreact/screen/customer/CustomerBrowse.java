package com.company.salesreact.screen.customer;

import io.jmix.ui.screen.*;
import com.company.salesreact.entity.Customer;

@UiController("Customer.browse")
@UiDescriptor("customer-browse.xml")
@LookupComponent("table")
public class CustomerBrowse extends MasterDetailScreen<Customer> {
}