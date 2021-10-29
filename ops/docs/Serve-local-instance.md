# Run a local instance of the Legislation Explorer in a virtual machine

By following this guide, you will be able to access the latest version of the Legislation Explorer on your local machine at `http://localhost:8001/`, without worrying about dependency and stack management, thanks to [Vagrant](https://vagrantup.com) and [Ansible](https://www.ansible.com/).

> For information, this guide was written with Ansible 2.11.2 running on Python 3.9.4, Vagrant 2.2.16 and VirtualBox 6.1.22.

## 1. Install a virtual machine provider

In order to isolate the Legislation Explorer environment from your environment, we will set it up in a [virtual machine](https://en.wikipedia.org/wiki/Virtual_machine).

If you don’t already have a [provider](https://www.vagrantup.com/docs/providers) installed (VirtualBox, Docker, VMWare, Hyper-V…), [install VirtualBox](https://www.virtualbox.org/manual/ch02.html).

### On a Mac with an Apple Silicon processor

VirtualBox is not compatible with Apple Silicon (M1…) processors. You will thus need to use the Docker provider.

To that end, install Docker Desktop through a [manual install](https://docs.docker.com/docker-for-mac/install/) or with `brew install homebrew/cask/docker`.

## 2. Set up Vagrant

Vagrant enables programmatic setup of virtual machines.

[Install Vagrant](https://www.vagrantup.com/downloads).

## 3. Install Ansible

To install Ansible, follow [the documentation](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-on-specific-operating-systems) for your operating system.

To check that Ansible is properly installed, run `ansible --version`. You should get something like:

```
ansible [core 2.11.2]
   …
```

## 4. Install and start the Legislation Explorer

1. Clone (or download) the `legislation-explorer` repository: `https://github.com/openfisca/legislation-explorer.git`.
2. Navigate to the freshly downloaded folder: `cd legislation-explorer`.
3. Type the following command: `vagrant up`. If you’re on an Apple Silicon machine or want to use Docker instead of VirtualBox, type `vagrant up --provider=docker`.

Once the command is done, you should have a virtual machine running the Legislation Explorer.

Thanks to Vagrant port forwarding, the port 80 inside the virtual machine is forwarded to another port on your development machine. You can thus access the Legislation Explorer on your local machine on the `8001` port: just open [`http://localhost:8001/`](http://localhost:8001/) in your browser.

> You can override that port with the `PORT` environment variable: `PORT=8081 vagrant up`.

> You can override the API URL with the `API_URL` environment variable: `API_URL=https://api.demo.openfisca.org/latest vagrant up`.

> On such a local virtual machine, the application is by default served over HTTP instead of HTTPS, as SSL certificates cannot be automatically provisioned by Let’s Encrypt.

> The `reverse_proxy_base_path` variable won't have any effect when using this local virtual machine setup. When using Vagrant, by default the app is accessed directly, with no reverse proxy.
