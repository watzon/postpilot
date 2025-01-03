PROGRAM_NAME=postpilot

PKG_PATH = github.com/watzon/postpilot
COMMIT=$(shell git rev-parse --short HEAD)
BRANCH=$(shell git rev-parse --abbrev-ref HEAD)
TAG=$(shell git describe --tags |cut -d- -f1)
ARCH=$(shell uname -m)

# Convert system architecture to Go architecture
ifeq ($(ARCH),x86_64)
    GOARCH=amd64
else ifeq ($(ARCH),aarch64)
    GOARCH=arm64
endif

# Check for webkit versions and set build tags
WEBKIT_41_CHECK := $(shell pkg-config --exists webkit2gtk-4.1 && echo "yes" || echo "no")
WEBKIT_40_CHECK := $(shell pkg-config --exists webkit2gtk-4.0 && echo "yes" || echo "no")

ifeq ($(WEBKIT_41_CHECK),yes)
    WEBKIT_TAGS=webkit2_41
else ifeq ($(WEBKIT_40_CHECK),yes)
    WEBKIT_TAGS=
else
    $(error "Neither webkit2gtk-4.0 nor webkit2gtk-4.1 development packages found. Please install one of them.")
endif

LDFLAGS = -w -s -X main.Version=$(TAG) -X main.Commit=$(COMMIT) -X main.Branch=$(BRANCH) -X main.useWails=true

.PHONY: help clean dep build install uninstall

.DEFAULT_GOAL := help

help:
	@echo "Usage: make <target>"
	@echo "Targets:"
	@echo "  clean       Clean the build directory"
	@echo "  dep         Install dependencies"
	@echo "  build       Build the program"
	@echo "  install     Install the program"
	@echo "  uninstall   Uninstall the program"

clean:
	rm -rf bin

dep:
	GOARCH=$(GOARCH) go mod download
	cd frontend && npm install

lint: dep
	golangci-lint run --timeout 5m -E revive -e '(struct field|type|method|func) [a-zA-Z`]+ should be [a-zA-Z`]+'
	gosec -quiet ./...

test: dep
	GOARCH=$(GOARCH) go test -race -p 1 -timeout 300s -coverprofile=.test_coverage.txt ./... && \
	go tool cover -func=.test_coverage.txt | grep -vE '^(total|ok)$$' | sort -k 3,3nr | awk '{print "|", $$3, "|", $$1, "|", $$2, "|"}'
	@rm -f .test_coverage.txt

frontend: dep
	cd frontend && npm run build

bindings: dep frontend
	GOARCH=$(GOARCH) go build -ldflags "-s -w -X main.useWails=true" -tags "bindings $(WEBKIT_TAGS)" -o bindings && ./bindings && rm -f ./bindings

build: bindings
	GOARCH=$(GOARCH) wails build -tags "$(WEBKIT_TAGS)"

install:
	# Binary installation
	install -pm 755 build/bin/${PROGRAM_NAME} /usr/local/bin/${PROGRAM_NAME}
	# Desktop file
	install -dm 755 /usr/share/applications/
	install -pm 644 build/linux/postpilot_0.0.0_ARCH/usr/share/applications/postpilot.desktop /usr/share/applications/
	# Icon
	install -dm 755 /usr/share/icons/hicolor/512x512/apps/
	install -pm 644 build/linux/postpilot_0.0.0_ARCH/usr/share/icons/hicolor/512x512/apps/postpilot.png /usr/share/icons/hicolor/512x512/apps/
	# Appdata
	install -dm 755 /usr/share/metainfo/
	install -pm 644 build/linux/postpilot_0.0.0_ARCH/usr/share/metainfo/tech.watzon.postpilot.appdata.xml /usr/share/metainfo/
	# Update icon cache
	-gtk-update-icon-cache -f -t /usr/share/icons/hicolor

uninstall:
	rm -f /usr/local/bin/${PROGRAM_NAME}
	rm -f /usr/share/applications/postpilot.desktop
	rm -f /usr/share/icons/hicolor/512x512/apps/postpilot.png
	rm -f /usr/share/metainfo/tech.watzon.postpilot.appdata.xml
	-gtk-update-icon-cache -f -t /usr/share/icons/hicolor
