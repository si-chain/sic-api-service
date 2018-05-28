## Introduction (in file)

This project was built to be a separate REST/JSON API service for third-party
applications to use for communicating with an existing SIC blockchain network.
It's built as a standalone service, as opposed to directly implemented in EOS,
to provide for:

* cleaner separate of concerns,
* help lessen the processing load and memory footprint of blockchain
* provide a standard API service that third-party developers can utilize with
  their existing toolchain, libraries and frameworks.
