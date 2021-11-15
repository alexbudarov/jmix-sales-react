package com.company.salesreact.app;

import io.jmix.core.DataManager;
import io.leangen.graphql.annotations.GraphQLMutation;
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.company.salesreact.entity.User;

@GraphQLApi
@Service("UserResolver")
public class UserResolver {
    @Autowired
    private DataManager dataManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GraphQLMutation
    public User deactivateUser(User user) {
        User freshUser = dataManager.load(User.class).id(user.getId()).one();
        if (freshUser.getActive()) {
            freshUser.setActive(false);
            freshUser = dataManager.save(freshUser);
        }
        return freshUser;
    }

    @GraphQLMutation
    public User banUser(User user, String oldPassword, String newPassword) {
        User freshUser = dataManager.load(User.class).id(user.getId()).one();
        if (passwordEncoder.matches(oldPassword, freshUser.getPassword())) {
            String newEncoded = passwordEncoder.encode(newPassword);
            freshUser.setPassword(newEncoded);
            freshUser = dataManager.save(freshUser);
        }
        return freshUser;
    }
}

