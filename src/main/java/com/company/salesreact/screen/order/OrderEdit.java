package com.company.salesreact.screen.order;

import io.jmix.ui.screen.*;
import com.company.salesreact.entity.Order;

@UiController("Order_.edit")
@UiDescriptor("order-edit.xml")
@EditedEntityContainer("orderDc")
public class OrderEdit extends StandardEditor<Order> {
}