import ItemModel from "../Models/Item.js";
import Laptop from "../Models/item_models/Laptop.js";
import Monitor from "../Models/item_models/Monitor.js";
import Tablet from "../Models/item_models/Tablet.js";
export const create = async (req, res) => {
  try {
    switch (req.body.category) {
      case "Ноутбуки":
        const item = await Laptop.create({
          user: req.userId,
          name: req.body.name,
          description: req.body.description,
          category: req.body.category,
          sale: req.body.sale,
          quantity: req.body.quantity,
          price: req.body.price,
          rating: req.body.rating,
          reviewsAmount: req.body.reviewsAmount,
          image: req.body.image,
          fields: {
            processor: req.body.processor,
            RAM: req.body.RAM,
            brand: req.body.brand,
            series: req.body.series,
            construction: req.body.construction,
            operatingSystem: req.body.operatingSystem,
            screenDiagonal: req.body.screenDiagonal,
            matrixType: req.body.matrixType,
            coatingType: req.body.coatingType,
            resolution: req.body.resolution,
            touchScreen: req.body.touchScreen,
            refreshRate: req.body.refreshRate,
            brightness: req.body.brightness,
            otherDisplayFeatures: req.body.otherDisplayFeatures,
            maxRAM: req.body.maxRAM,
            storageType: req.body.storageType,
            storageCapacity: req.body.storageCapacity,
            opticalDrive: req.body.opticalDrive,
            gpuAdapter: req.body.gpuAdapter,
            externalPorts: req.body.externalPorts,
            cardReader: req.body.cardReader,
            webcam: req.body.webcam,
            keyboardBacklight: req.body.keyboardBacklight,
            passiveCooling: req.body.passiveCooling,
            fingerprintScanner: req.body.fingerprintScanner,
            numericKeypad: req.body.numericKeypad,
            intelEvoCertification: req.body.intelEvoCertification,
            ethernetAdapter: req.body.ethernetAdapter,
            wifi: req.body.wifi,
            bluetooth: req.body.bluetooth,
            weight: req.body.weight,
            dimensions: req.body.dimensions,
            bodyMaterial: req.body.bodyMaterial,
            lidColor: req.body.lidColor,
            bodyColor: req.body.bodyColor,
            ruggedLaptop: req.body.ruggedLaptop,
          },
        });
        return res.status(200).json({
          success: true,
          items: item,
        });

      case "Монітори":
        const monitor = await Monitor.create({
          user: req.userId,
          name: req.body.name,
          description: req.body.description,
          category: req.body.category,
          sale: req.body.sale,
          quantity: req.body.quantity,
          price: req.body.price,
          rating: req.body.rating,
          reviewsAmount: req.body.reviewsAmount,
          image: req.body.image,
          fields: {
            brand: req.body.brand,
            screenDiagonal: req.body.screenDiagonal,
            matrixType: req.body.matrixType,
            aspectRatio: req.body.aspectRatio,
            resolution: req.body.resolution,
            responseTime: req.body.responseTime,
            viewingAngles: req.body.viewingAngles,
            backlightType: req.body.backlightType,
            brightness: req.body.brightness,
            contrastRatio: req.body.contrastRatio,
            screenCoating: req.body.screenCoating,
            curvedScreen: req.body.curvedScreen,
            refreshRate: req.body.refreshRate,
          },
        });
        return res.status(200).json({
          success: true,
          items: monitor,
        });

      case "Планшети":
        const tablet = await Tablet.create({
          user: req.userId,
          name: req.body.name,
          description: req.body.description,
          category: req.body.category,
          sale: req.body.sale,
          quantity: req.body.quantity,
          price: req.body.price,
          rating: req.body.rating,
          reviewsAmount: req.body.reviewsAmount,
          image: req.body.image,
          fields: {
            brand: req.body.brand,
            line: req.body.line,
            preinstalledOS: req.body.preinstalledOS,
            screenDiagonal: req.body.screenDiagonal,
            resolution: req.body.resolution,
            matrixType: req.body.matrixType,
            lightSensor: req.body.lightSensor,
            memoryRAM: req.body.memoryRAM,
            builtInMemory: req.body.builtInMemory,
            memoryExpansionSlot: req.body.memoryExpansionSlot,
            processor: req.body.processor,
            processorFrequency: req.body.processorFrequency,
            processorCores: req.body.processorCores,
            builtInSpeakers: req.body.builtInSpeakers,
            batteryCapacity: req.body.batteryCapacity,
            frontCamera: req.body.frontCamera,
            rearCamera: req.body.rearCamera,
            wifi: req.body.wifi,
            cellularNetwork: req.body.cellularNetwork,
            voiceCommunication: req.body.voiceCommunication,
            gps: req.body.gps,
            nfc: req.body.nfc,
            externalPorts: req.body.externalPorts,
            weight: req.body.weight,
            dimensions: req.body.dimensions,
            bodyColor: req.body.bodyColor,
            frontPanelColor: req.body.frontPanelColor,
          },
        });
        return res.status(200).json({
          success: true,
          items: tablet,
        });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    // Finding all items.
    const items = await ItemModel.find();

    res.status(200).json({
      success: true,
      items: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    // Trying to find item by provided id.
    const item = await ItemModel.findById(req.params.id);

    if (!item) {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    } else {
      res.status(200).json({
        success: true,
        items: item,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};
export const getOneCategory = async (req, res) => {
  try {
    // Trying to find item by provided category.
    const category = req.params.category;
    const item = await ItemModel.find({ category: { $eq: category } });

    if (!item) {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    } else {
      res.status(200).json({
        items: item,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const remove = async (req, res) => {
  try {
    // Trying to find item by provided id.

    await ItemModel.findOneAndDelete({
      _id: req.params.id,
    })
      .then((doc) => {
        if (doc.user !== undefined) {
          res.status(200).json({
            success: true,
          });
        } else {
          res.status(400).json({
            success: false,
            error: "Non user items can`t be deleted",
          });
        }
      })
      .catch(() => {
        res.status(404).json({
          success: false,
          error: "Not found",
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const searchItem = async (req, res) => {
  try {
    const items = await ItemModel.find({
      $or: [{ name: { $regex: req.params.name, $options: "i" } }],
    });
    if (items) {
      res.status(200).json({
        success: true,
        items: items,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error searching items" });
  }
};

export const updateItemFields = async (req, res) => {
  try {
    // Trying to find item by provided id.
    console.log(req.body.category);
    switch (req.body.category) {
      case "Ноутбуки":
        await Laptop.findOneAndUpdate(
          {
            _id: req.params.id,
            user: req.userId,
          },
          {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            sale: req.body.sale,
            quantity: req.body.quantity,
            price: req.body.price,
            rating: req.body.rating,
            reviewsAmount: req.body.reviewsAmount,
            image: req.body.image,
            fields: {
              processor: req.body.processor,
              RAM: req.body.RAM,
              brand: req.body.brand,
              series: req.body.series,
              construction: req.body.construction,
              operatingSystem: req.body.operatingSystem,
              screenDiagonal: req.body.screenDiagonal,
              matrixType: req.body.matrixType,
              coatingType: req.body.coatingType,
              resolution: req.body.resolution,
              touchScreen: req.body.touchScreen,
              refreshRate: req.body.refreshRate,
              brightness: req.body.brightness,
              otherDisplayFeatures: req.body.otherDisplayFeatures,
              maxRAM: req.body.maxRAM,
              storageType: req.body.storageType,
              storageCapacity: req.body.storageCapacity,
              opticalDrive: req.body.opticalDrive,
              gpuAdapter: req.body.gpuAdapter,
              externalPorts: req.body.externalPorts,
              cardReader: req.body.cardReader,
              webcam: req.body.webcam,
              keyboardBacklight: req.body.keyboardBacklight,
              passiveCooling: req.body.passiveCooling,
              fingerprintScanner: req.body.fingerprintScanner,
              numericKeypad: req.body.numericKeypad,
              intelEvoCertification: req.body.intelEvoCertification,
              ethernetAdapter: req.body.ethernetAdapter,
              wifi: req.body.wifi,
              bluetooth: req.body.bluetooth,
              weight: req.body.weight,
              dimensions: req.body.dimensions,
              bodyMaterial: req.body.bodyMaterial,
              lidColor: req.body.lidColor,
              bodyColor: req.body.bodyColor,
              ruggedLaptop: req.body.ruggedLaptop,
            },
          },
          { new: true }
        ).then((doc) => {
          if (doc) {
            if (doc.user !== undefined) {
              res.status(200).json({
                success: true,
                items: doc,
              });
            } else {
              res.status(400).json({
                success: false,
                error: "Non user items can`t be edited",
              });
            }
          }
        });

      case "Монітори":
        await Monitor.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            sale: req.body.sale,
            quantity: req.body.quantity,
            price: req.body.price,
            rating: req.body.rating,
            reviewsAmount: req.body.reviewsAmount,
            image: req.body.image,
            fields: {
              brand: req.body.brand,
              screenDiagonal: req.body.screenDiagonal,
              matrixType: req.body.matrixType,
              aspectRatio: req.body.aspectRatio,
              resolution: req.body.resolution,
              responseTime: req.body.responseTime,
              viewingAngles: req.body.viewingAngles,
              backlightType: req.body.backlightType,
              brightness: req.body.brightness,
              contrastRatio: req.body.contrastRatio,
              screenCoating: req.body.screenCoating,
              curvedScreen: req.body.curvedScreen,
              refreshRate: req.body.refreshRate,
            },
          },
          { new: true }
        ).then((doc) => {
          if (doc) {
            if (doc.user !== undefined) {
              res.status(200).json({
                success: true,
                items: doc,
              });
            } else {
              res.status(400).json({
                success: false,
                error: "Non user items can`t be edited",
              });
            }
          }
        });

      case "Планшети":
        await Tablet.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            sale: req.body.sale,
            quantity: req.body.quantity,
            price: req.body.price,
            rating: req.body.rating,
            reviewsAmount: req.body.reviewsAmount,
            image: req.body.image,
            fields: {
              brand: req.body.brand,
              line: req.body.line,
              preinstalledOS: req.body.preinstalledOS,
              screenDiagonal: req.body.screenDiagonal,
              resolution: req.body.resolution,
              matrixType: req.body.matrixType,
              lightSensor: req.body.lightSensor,
              memoryRAM: req.body.memoryRAM,
              builtInMemory: req.body.builtInMemory,
              memoryExpansionSlot: req.body.memoryExpansionSlot,
              processor: req.body.processor,
              processorFrequency: req.body.processorFrequency,
              processorCores: req.body.processorCores,
              builtInSpeakers: req.body.builtInSpeakers,
              batteryCapacity: req.body.batteryCapacity,
              frontCamera: req.body.frontCamera,
              rearCamera: req.body.rearCamera,
              wifi: req.body.wifi,
              cellularNetwork: req.body.cellularNetwork,
              voiceCommunication: req.body.voiceCommunication,
              gps: req.body.gps,
              nfc: req.body.nfc,
              externalPorts: req.body.externalPorts,
              weight: req.body.weight,
              dimensions: req.body.dimensions,
              bodyColor: req.body.bodyColor,
              frontPanelColor: req.body.frontPanelColor,
            },
          },
          { new: true }
        ).then((doc) => {
          if (doc) {
            if (doc.user !== undefined) {
              res.status(200).json({
                success: true,
                items: doc,
              });
            } else {
              res.status(400).json({
                success: false,
                error: "Non user items can`t be edited",
              });
            }
          }
        });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const item = await ItemModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $inc: { quantity: req.body.quantity ? req.body.quantity : 0 },
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        sale: req.body.sale,
        price: req.body.price,
        rating: req.body.rating,
        reviewsAmount: req.body.reviewsAmount,
        image: req.body.image,
      },
      { new: true }
    );

    if (!item) {
      res.status(400).json({
        success: false,
        error: "Item not found",
      });
    } else {
      res.status(200).json({
        success: true,
        items: item,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};
