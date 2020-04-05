package edu.uiuc.cs411.project.nba.stats.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.util.Optional;

/**
 * This is our Production Persistence Mode
 * To run the app in the docker container or in the GCP
 *
 * Database will use the real MYSQL from Google Cloud SQL
 */
@Configuration
@MapperScan("edu.uiuc.cs411.project.nba.stats")
@Profile("prod")
public class PersistenceConfig {

    private static final String HOST_ENV_VARIABLE = "DB_HOST";
    private static final String HOST_DEFAULT_VALUE = "localhost";
    private static final String HOST_VALUE = getEnvironmentVariableOrDefault(HOST_ENV_VARIABLE, HOST_DEFAULT_VALUE);

    private static final String NAME_ENV_VARIABLE = "DB_NAME";
    private static final String NAME_DEFAULT_VALUE = "nba";
    private static final String NAME_VALUE = getEnvironmentVariableOrDefault(NAME_ENV_VARIABLE, NAME_DEFAULT_VALUE);

    private static final String USER_ENV_VARIABLE = "DB_USER";
    private static final String USER_DEFAULT_VALUE = "nba-stats-backend";
    private static final String USER_VALUE = getEnvironmentVariableOrDefault(USER_ENV_VARIABLE, USER_DEFAULT_VALUE);

    private static final String PASSWORD_ENV_VARIABLE = "DB_PASS";
    private static final String PASSWORD_DEFAULT_VALUE = "";
    private static final String PASSWORD_VALUE = getEnvironmentVariableOrDefault(PASSWORD_ENV_VARIABLE, PASSWORD_DEFAULT_VALUE);

    private static final String CONNECTION_NAME_ENV_VARIABLE = "CLOUD_SQL_CONNECTION_NAME";
    private static final String CONNECTION_NAME_DEFAULT_VALUE = "cs-411-data-gssn-kat:us-west1:nbastats-database";
    private static final String CONNECTION_NAME_VALUE = getEnvironmentVariableOrDefault(CONNECTION_NAME_ENV_VARIABLE,CONNECTION_NAME_DEFAULT_VALUE);

    private static final String JDBC_URL = "jdbc:mysql://%s/%s";
    private static final String SOCKET_FACTORY = "socketFactory";
    private static final String CLOUD_SQL_INSTANCE = "cloudSqlInstance";
    private static final String USE_SSL = "useSSL";
    private static final String GCP_SOCKET_FACTORY = "com.google.cloud.sql.mysql.SocketFactory";

    @Bean
    public DataSource dataSource() {
        final HikariConfig config = new HikariConfig();
        config.setJdbcUrl(String.format(JDBC_URL, HOST_VALUE, NAME_VALUE));
        config.setUsername(USER_VALUE);
        config.setPassword(PASSWORD_VALUE);

        // Empty DB_HOST means it's running on GCP
        if (HOST_VALUE.isEmpty()) {
            config.addDataSourceProperty(SOCKET_FACTORY, GCP_SOCKET_FACTORY);
            config.addDataSourceProperty(CLOUD_SQL_INSTANCE, CONNECTION_NAME_VALUE);
            config.addDataSourceProperty(USE_SSL, "false");
        }

        return new HikariDataSource(config);
    }

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        final SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        return factoryBean.getObject();
    }

    private static String getEnvironmentVariableOrDefault(String variable, String defaultValue) {
        return Optional.ofNullable(System.getenv(variable)).orElse(defaultValue);
    }

}
