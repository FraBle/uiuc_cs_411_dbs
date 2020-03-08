package edu.uiuc.cs411.project.nba.stats.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
@MapperScan("edu.uiuc.cs411.project.nba.stats")
public class PersistenceConfig {

    private static final String DB_HOST = PersistenceConfig.getEnvironmentVariable("DB_HOST", "");
    private static final String DB_NAME = PersistenceConfig.getEnvironmentVariable("DB_NAME", "nba");
    private static final String DB_USER = PersistenceConfig.getEnvironmentVariable("DB_USER", "nba-stats-backend");
    private static final String DB_PASS = PersistenceConfig.getEnvironmentVariable("DB_PASS", null);
    private static final String CLOUD_SQL_CONNECTION_NAME = PersistenceConfig.getEnvironmentVariable("CLOUD_SQL_CONNECTION_NAME", "cs-411-data-gssn-kat:us-west1:nbastats-db");

    @Bean
    public DataSource dataSource() {
        final HikariConfig config = new HikariConfig();
        config.setJdbcUrl(String.format("jdbc:mysql://%s/%s", DB_HOST, DB_NAME));
        config.setUsername(DB_USER);
        config.setPassword(DB_PASS);

        if (DB_HOST == ""){
            // No DB_HOST means it's running on GCP
            config.addDataSourceProperty("socketFactory",
            "com.google.cloud.sql.mysql.SocketFactory");
            config.addDataSourceProperty("cloudSqlInstance", CLOUD_SQL_CONNECTION_NAME);
            config.addDataSourceProperty("useSSL", "false");
        }

        return new HikariDataSource(config);
    }

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        final SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        return factoryBean.getObject();
    }

    private static String getEnvironmentVariable(String variable, String defaultValue){
        String value = System.getenv(variable);
        if (value == null)
            return defaultValue;
        return value;
    }

}
