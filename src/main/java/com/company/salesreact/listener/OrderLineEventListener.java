package com.company.salesreact.listener;

import com.company.salesreact.entity.Order;
import com.company.salesreact.entity.OrderLine;
import io.jmix.core.DataManager;
import io.jmix.core.Id;
import io.jmix.core.event.EntityChangedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collection;

@Component
public class OrderLineEventListener {
    @Autowired
    private DataManager dataManager;

    @EventListener
    public void onOrderLineChangedBeforeCommit(EntityChangedEvent<OrderLine> event) {
        Order order = dataManager.load(Order.class)
                    .query("select o from Order_ o join o.lines l where l.id = :lineId")
                    .parameter("lineId", event.getEntityId())
                    .optional()
                    .orElse(null);

        if (order != null) {
            if (order.getLines() != null) {
                BigDecimal total = getTotal(order.getLines());
                order.setTotal(total);
            } else {
                order.setTotal(BigDecimal.ZERO);
            }
        }
    }

    public BigDecimal getTotal(Collection<OrderLine> orderLines) {
        BigDecimal total = orderLines.stream()
                .map(line -> line.getCount().multiply(line.getProduct().getPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return total;
    }
}