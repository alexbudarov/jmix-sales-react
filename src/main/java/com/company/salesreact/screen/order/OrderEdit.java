package com.company.salesreact.screen.order;

import com.company.salesreact.listener.OrderLineEventListener;
import io.jmix.ui.model.DataContext;
import io.jmix.ui.screen.*;
import com.company.salesreact.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;

@UiController("Order_.edit")
@UiDescriptor("order-edit.xml")
@EditedEntityContainer("orderDc")
public class OrderEdit extends StandardEditor<Order> {
    @Autowired
    private OrderLineEventListener orderLineEventListener;

    @Subscribe(target = Target.DATA_CONTEXT)
    public void onPreCommit(DataContext.PreCommitEvent event) {
        BigDecimal total = orderLineEventListener.getTotal(getEditedEntity().getLines());
        getEditedEntity().setTotal(total);
    }
    
}