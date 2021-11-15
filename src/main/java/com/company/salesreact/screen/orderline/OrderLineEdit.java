package com.company.salesreact.screen.orderline;

import io.jmix.ui.screen.*;
import com.company.salesreact.entity.OrderLine;

@UiController("OrderLine.edit")
@UiDescriptor("order-line-edit.xml")
@EditedEntityContainer("orderLineDc")
public class OrderLineEdit extends StandardEditor<OrderLine> {
}