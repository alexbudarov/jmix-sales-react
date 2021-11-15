package com.company.salesreact.screen.product;

import io.jmix.ui.screen.*;
import com.company.salesreact.entity.Product;

@UiController("Product.browse")
@UiDescriptor("product-browse.xml")
@LookupComponent("table")
public class ProductBrowse extends MasterDetailScreen<Product> {
}