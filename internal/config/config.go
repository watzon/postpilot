package config

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/viper"
)

type Config struct {
	Server ServerConfig `mapstructure:"server"`
}

type ServerConfig struct {
	Host              string `mapstructure:"host"`
	Port              int    `mapstructure:"port"`
	Domain            string `mapstructure:"domain"`
	ReadTimeout       int    `mapstructure:"read_timeout"`
	WriteTimeout      int    `mapstructure:"write_timeout"`
	MaxMessageBytes   int    `mapstructure:"max_message_bytes"`
	MaxRecipients     int    `mapstructure:"max_recipients"`
	AllowInsecureAuth bool   `mapstructure:"allow_insecure_auth"`
}

func LoadConfig() (*Config, error) {
	config := &Config{}

	// Set defaults
	viper.SetDefault("server.host", "localhost")
	viper.SetDefault("server.port", 1025)
	viper.SetDefault("server.domain", "localhost")
	viper.SetDefault("server.read_timeout", 10)
	viper.SetDefault("server.write_timeout", 10)
	viper.SetDefault("server.max_message_bytes", 1024*1024)
	viper.SetDefault("server.max_recipients", 50)
	viper.SetDefault("server.allow_insecure_auth", true)

	// Config file
	configDir := filepath.Join(os.Getenv("HOME"), ".config", "mailviewer")
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(configDir)

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, fmt.Errorf("error reading config file: %w", err)
		}
	}

	if err := viper.Unmarshal(config); err != nil {
		return nil, fmt.Errorf("error unmarshaling config: %w", err)
	}

	return config, nil
}
